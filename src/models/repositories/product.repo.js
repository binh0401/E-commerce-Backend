'use strict'

const { product, electronic, furniture, clothing } = require("../product.model")

const findAllDraftsOfShop = async({query, limit, skip}) => {
  return await product.find(query)
  .populate('product_shop', 'name email -_id')
  .sort({updateAt: -1})
  .skip(skip)
  .limit(limit)
  .lean()
}


module.exports = {
  findAllDraftsOfShop
}

