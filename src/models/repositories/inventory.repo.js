'use strict'
const {inventory} = require('../inventory.model')

const {Types} = require('mongoose')

const insertInventory = async({
  productId, location='unknown', stock, shopId
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId
  })
}

module.exports = {insertInventory}