'use strict'

import {Schema, model} from 'mongoose'; // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'


// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey:{
        type: String,
        required: true,
    },
    privateKey:{
        type: String,
        required: true,
    },
    refreshTokensUsed:{       //Used Refresh Token
        type: Array,
        default: []
    },
    refreshToken: {          //Using Refresh Token
        type: String,
        required: true
    }

},
{
  collection: COLLECTION_NAME,
  timestamps: true
});

//Export the model
export default model(DOCUMENT_NAME, keyTokenSchema);