'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const shopRoles = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}


class AccessService{
  static signUp = async({name, email, password}) => {
    try {
      //step 1: check email exist ?
      const holderShop = await shopModel.findOne(email).lean() //faster query, return a pure JS object

      if(holderShop){
        return {
          code: 'xxx',
          message: 'Shop already registered'
        }
      }
      
      //Save User Data
      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [shopRoles.SHOP]
      })


      //2 ways: 
      //#1: Signup, then redirect to login  -> no need for token in the sign up step
      //#2: Signup and give refresh and access token --> this way

      //Generate publickey and private key
      if(newShop){
        const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa')

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey
        })

        if(!publicKeyString){
          return {
            code: 'xxx',
            message: 'publicKeyString error',
          }
        }
      }

      



    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService