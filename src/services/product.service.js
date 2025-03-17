'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')

//Apply Factory Pattern
class ProductFactory {

  static productRegistry = {} //key-class

  static registerProductType( type, classRef ) {
      ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {   //payload: {shop's payload}
    const productClass = ProductFactory.productRegistry[type]
    if(!productClass) throw new BadRequestError('Invalid Product Type', type)

    return new productClass(payload).createProduct()
  }
}

class Product {
  constructor({
    product_name, product_thumb, product_description,
    product_price, product_quantity, product_type, product_shop,
    product_attributes
  }) {
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
  async createProduct(_id) {
    return await product.create({ ...this, _id })
  }

}

//Sub-class for clothing
class Clothing extends Product {

  //automatically call constructor of Products
  //Or we can explicitly define a constructor
  // constructor(payload){
  //   super(payload)
  // }

  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) throw new BadRequestError('Create new Clothing Error')

    const newProduct = await super.createProduct()
    if (!newProduct) throw new BadRequestError('Create new Product Error')

    return newProduct
  }
}

//Sub-class for electronic
class Electronic extends Product {

  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) throw new BadRequestError('Create new Electronic Error')

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('Create new Product Error')

    return newProduct
  }
}

//Sub-class for furniture
class Furniture extends Product {

  async createProduct (){
    const newFurniture = await furniture.create({
        ...this.product_attributes,
        product_shop: this.product_shop
    })
    if(!newFurniture) throw new BadRequestError('Create new Furniture Error')

    const newProduct = super.createProduct(newFurniture._id)
    if(!newProduct) throw new BadRequestError('Create new Product Error')
    
    return newProduct
  }
}


//register product types:
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)
//

module.exports = ProductFactory

