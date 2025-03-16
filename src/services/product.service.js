'use strict'

const {product, clothing, electronic} = require('../models/product.model')
const {BadRequestError} = require('../core/error.response')

//Apply Factory Pattern
class ProductFactory {
  static async createProduct(type, payload){
      switch (type){
        case 'Electronic':
          return new Electronic(payload).createProduct()
        case 'Clothing':
          return new Clothing(payload).createProduct()
        default: 
          throw new BadRequestError(`Invalid Product Category: ${type}`)
      }
  }
}

class Product{
  constructor({
    product_name, product_thumb, product_description,
    product_price, product_quantity, product_type, product_shop,
    product_attributes
  }){
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  //create new product
  async createProduct(){
    return await product.create(this)
  }

}

//Sub-class for clothing
class Clothing extends Product{

  //automatically call constructor of Products
  //Or we can explicitly define a constructor
  // constructor(payload){
  //   super(payload)
  // }
  
  async createProduct(){
    const newClothing = await clothing.create(this.product_attributes)
    if(!newClothing) throw new BadRequestError('Create new Clothing Error')
    
    const newProduct = await super.createProduct()
    if(!newProduct) throw new BadRequestError('Create new Product Error')

    return newProduct
  }
}

//Sub-class for electronic
class Electronic extends Product{

  async createProduct(){
    const newElectronic = await electronic.create(this.product_attributes)
    if(!newElectronic) throw new BadRequestError('Create new Electronic Error')
    
    const newProduct = await super.createProduct()
    if(!newProduct) throw new BadRequestError('Create new Product Error')

    return newProduct
  }
}

module.exports = ProductFactory

