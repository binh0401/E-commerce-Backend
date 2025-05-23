'use strict'

import { Types } from 'mongoose'
import keyTokenModel from '../models/keytoken.model.js';

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

      const filter = { user: userId }
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

  static findPublicKeyByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.findByIdAndDelete(id)
  }

  static findRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshTokensUsed: refreshToken})
  }

  static deleteUserAuthInfoByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({user: new Types.ObjectId(userId)})
  }

  static findRefreshTokenUsing = async(refreshToken) => {
    return await keyTokenModel.findOne({refreshToken})
  }
}


export default KeyTokenService