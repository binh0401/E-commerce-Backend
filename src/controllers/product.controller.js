'use strict'

import ProductService from '../services/product.service.js';
import { OK, CREATED } from '../core/success.response.js'

class ProductController {

    //Create product
    createProduct = async (req, res, next) => {
      const type = req.body.product_type
      const payload = {...req.body, product_shop: req.user.userId}
      new CREATED({
        message: 'Create product success',
        metadata: await ProductService.createProduct(type, payload)
      }).send(res)
    }

    //Get all drafts of a shop
    findAllDraftsOfShop = async(req,res,next) => {
      new OK({
        message: 'Find all draft products success',
        metadata: await ProductService.findAllDraftsOfShop({product_shop: req.user.userId})
      }).send(res)
    }
    
    //Publish a product from drafts
    publishAProductOfShop = async(req,res,next) => {
      new OK({
        message: 'Publish a product from draft success',
        metadata: await ProductService.publishAProductOfShop({
          product_shop: req.user.userId,
          product_id: req.params.id})
      }).send(res)
    }

    //Get all published of a shop
    findAllPublishedOfShop = async(req,res,next) => {
      new OK({
        message: 'Find all published products success',
        metadata: await ProductService.findAllPublishedOfShop({product_shop: req.user.userId})
      }).send(res)
    }

    //Unpublish a product of shop
    unpublishAProductOfShop = async(req,res,next) => {
      new OK({
        message: 'Unpublish a product success',
        metadata: await ProductService.unpublishAProductOfShop({
          product_shop: req.user.userId,
          product_id: req.params.id})
      }).send(res)
    }

    //Search products by public, only search published products
    searchProductsByPublic = async(req,res,next) => {
      new OK({
        message: 'Search products by public success',
        metadata: await ProductService.searchProductsByPublic(req.params)
      }).send(res)
    }

    //Get all products by public, only get published products
    findAllProductsByPublic = async(req,res,next) => {
      new OK({
        message: 'Get all products by public success',
        metadata: await ProductService.findAllProductsByPublic(req.query)
      }).send(res)
    }

    //Get 1 product by public, only get published product
    findOneProductByPublic = async(req,res,next) => {
      new OK({
        message: 'Get one product by public success',
        metadata: await ProductService.findOneProductByPublic({
          product_id: req.params.id
        })
      }).send(res)
    }

    //Update 1 product of shop
    updateAProductOfShop = async(req,res,next) => {
      const type = req.body.product_type
      const payload = {...req.body, product_shop: req.user.userId}
      const productId = req.params.id
      new OK({
        message: 'Update a product success',
        metadata: await ProductService.updateAProductOfShop(type, payload, productId)
      }).send(res)
    }

}

export default new ProductController()