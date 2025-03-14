'use strict'

const { findById } = require("../models/shop.model")

const HEADER = {
  API_KEY : 'x-api-key',
  AUTHORIZATION : 'authorization'
}



const apiKey = async (req,res,next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if(!key){
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }

    //find obj key
    const objKey = await findById(key)

    if(!objKey){
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }

    req.objKey = objKey
    return next()
  } catch (error) {
    
  }
}