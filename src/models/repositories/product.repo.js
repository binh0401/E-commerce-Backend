'use strict'

import { Types }  from "mongoose"
import models  from "../product.model.js"
import { convertSelectData, convertUnselectData, convertToObjectId }  from "../../utils/index.js"
import { BadRequestError }  from "../../core/error.response.js"
const { product, electronic, furniture, clothing} = models

const publishAProductOfShop = async ({product_shop, product_id}) => {
    const foundProduct = await product.findOne({
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id)
    })

    if(!foundProduct) return null

    const filter = {_id: foundProduct._id}
    const update = {
     $set: {
      isDraft: false,
      isPublished: true
     }     
    }


    const { modifiedCount } = await product.updateOne(filter, update)

    return modifiedCount
    
}

const queryProducts = async({query, limit, skip}) => {
  return await product.find(query)
  .populate('product_shop', 'name email -_id')
  .sort({updatedAt: -1})
  .skip(skip)
  .limit(limit)
  .lean()
}

const unpublishAProductOfShop = async({product_shop, product_id}) => {
    const foundProduct = await product.findOne({
      _id: new Types.ObjectId(product_id),
      product_shop: new Types.ObjectId(product_shop) 
    })

    if(!foundProduct) return null

    const filter = {
      _id: foundProduct._id
    }

    const update = {
      $set: {
        isDraft: true,
        isPublished: false
      }
    }

    const {modifiedCount} = await product.updateOne(filter, update)
    return modifiedCount
}

const searchProductsByPublic = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isDraft: false,
        $text: {$search: regexSearch}},
        {score: {$meta: 'textScore'}}
    ).sort({score: {$meta: 'textScore'}}).lean()

    return results
}

const findAllProductsByPublic = async({limit, sort, page, filter, select}) => {
  //Pagination
    const skip = (page-1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const foundProducts = 
    await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(convertSelectData(select)) //convert array[a,b,c] to object: {a: 1, b: 1, c:0}
    .lean()

    return foundProducts

}

const findOneProductByPublic = async({product_id, unSelect}) => {
    return await product.findOne({
      _id: product_id,
      isPublished: true
    })
    .select(convertUnselectData(unSelect)) //convert [a,b,c] to {a:0, b:0, c:0} => select everything except a,b,c fields
}

const updateAProductOfShop = async({productId, payload, model, isNew = true}) => {
    const updateProduct = await model.findOne({_id: productId})

    if(updateProduct.product_shop !== payload.product_shop) throw new BadRequestError("You can not update other shop's product")

    return await model.findByIdAndUpdate(productId, payload, {
      new: isNew
    })
}

const findProductById = async(product_id) => {
  return await product.findOne({
    _id: convertToObjectId(product_id)
  }).lean()
}

const checkValidAllProducts = async (products) => {
  return await Promise.all(products.map(async (product) => {
      const foundProduct = await findProductById(product.product_id)
      if(foundProduct){
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          product_id: product.product_id
        }
      }//if not async function will automatically return a Promise resolve to undefined
  }))
}

export {
  queryProducts,
  publishAProductOfShop,
  unpublishAProductOfShop,
  searchProductsByPublic,
  findAllProductsByPublic,
  findOneProductByPublic,
  updateAProductOfShop,
  findProductById,
  checkValidAllProducts
  
  
}

