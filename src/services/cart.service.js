'use strict'
import {BadRequestError, NotFoundError}  from '../core/error.response.js'
import cart  from '../models/cart.model.js'
import {findProductById}  from '../models/repositories/product.repo.js'

/*

  1, Add product to cart : User
     Create new cart : User

  2, Reduce product quantity: User
  2, Increase product quantity: User

  3, Delete cart item: User
  4, Get products of cart: User
 
  
*/

/*
{
  product_id,
  shop_id,
  quantity,
  name,
  price        
 }
*/


class CartService{

  //1

  static async addToCart({user_id, product = {} }){
      
    const userCart = await cart.findOne({
      cart_user_id: user_id,
      cart_state: 'active'
    })

    //No cart
    if(!userCart){
      //create a cart for user
      const newCart =  await cart.create({
        cart_state: 'active',
        cart_products: [product],
        cart_count_product : product.quantity,
        cart_user_id: user_id
      })
      return newCart
    }

    //already had a cart:
    const {product_id, quantity} = product
    //1. No product in cart
    if(!userCart.cart_count_product){
      userCart.cart_products = [product]
      userCart.cart_count_product = quantity
    }else{
    //2. Already have product in cart
      
      userCart.cart_count_product += quantity
      const existingProduct = userCart.cart_products.find(product => product.product_id === product_id)

      if(!existingProduct){
        userCart.cart_products.push(product)
      }else{
        existingProduct.quantity += quantity
      }
    }
    return await userCart.save() 
  }

  /*
    shop_order_ids: [


      {
        shop_id,
        item_products: [
            {
              price,
              shop_id,
              old_quantity,
              new_quantity,
              product_id
            }
        ],
        version
      }
      

    ]

  */


  //2
  static async updateCart({user_id, shop_order_ids = []}){
    
    const {product_id, old_quantity, new_quantity} = shop_order_ids[0]?.item_products[0]
    
    //find the added product
    const foundProduct = await findProductById(product_id)
    if(!foundProduct) throw new NotFoundError('Product not exist')
    
    //Check if correct shop
    if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shop_id){
      throw new BadRequestError('Product do not belong to the shop')
    }
    
    //Check the cart if exist (this API only use when the cart has been existed)
    const foundCart = await cart.findOne({
      cart_state: 'active',
      cart_user_id: user_id
    })

    if(!foundCart) throw new NotFoundError('This cart does not exist')
    //Check if the added product is already in the cart(only work when this product has been added before)
    const existingProduct = foundCart.cart_products.find(product => product.product_id === product_id)
    if(!existingProduct) throw new NotFoundError('This product does not exist')

    //Check if old quantity is 0 => should be deleted, can't modify using API
    if(old_quantity === 0 && existingProduct.quantity === 0){
      //delete this product out of cart
      foundCart.cart_products = foundCart.cart_products.filter(product => product.product_id !== product_id)
      foundCart.markModified('cart_products')
      return await foundCart.save()
    }

    //Check if FE does not pass a valid quantity
    if(existingProduct.quantity + new_quantity - old_quantity < 0){
      existingProduct.quantity = 0
      foundCart.cart_count_product -= existingProduct.quantity
      foundCart.markModified('cart_products')
      return await foundCart.save()
    }

    existingProduct.quantity += new_quantity - old_quantity
    foundCart.cart_count_product += new_quantity - old_quantity
    foundCart.markModified('cart_products')
    return await foundCart.save()
  }


  //3 Delete product of cart
  static async deleteProductOfCart({user_id, product_id}){
    const query = {
      cart_user_id: user_id, 
      cart_state: 'active'
    }

    const foundCart = await cart.findOne(query)

    if(!foundCart) throw new NotFoundError('Cart not exist')

    const existingProduct = foundCart.cart_products.find(product => product.product_id === product_id)
    if(!existingProduct) throw new NotFoundError('Product not exist')

    const update = {
      $pull: {
        cart_products: {product_id}
      },

      $inc: {
        cart_count_product: -existingProduct.quantity
      }
    }

    await cart.findOneAndUpdate(query, update, {isNew: true})  
    return cart.findOne(query)  
  }

  //4 Get products in cart
  static async getProductsInCart({user_id}){
      return await cart.findOne({
        cart_state: 'active',
        cart_user_id: user_id
      }).select('cart_products').lean()
  }

  //5 Delete all cart
  static async deleteAllCart({user_id}){
    const query = {
      cart_state: 'active',
      cart_user_id: user_id
    }
    const foundCart = await cart.findOne(query)
    foundCart.cart_products = []
    foundCart.cart_count_product = 0
    await foundCart.save()
    return foundCart
  }
}

export default CartService
