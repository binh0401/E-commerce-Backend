'use strict'

const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {

  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      
      //level 0
      // const keys = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })

      // return keys ? keys.publicKey : null

      const filter = {user: userId}
      const update = {
        publicKey, privateKey, refreshTokensUsed: [], refreshToken
      }
      const options = { upsert: true, new: true }  //upsert: if none-> insert, if exist update

      const keys = await keyTokenModel.findOneAndUpdate(filter, update, options)

      return keys ? keys.publicKey : null



    } catch (error) {
      return error
    }
  }
}


module.exports = KeyTokenService