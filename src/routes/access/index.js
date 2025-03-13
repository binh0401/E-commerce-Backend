'use strict'

const accessController = require('../../controllers/access.controller')
const express = require('express')
const router = express.Router()

// signUp
router.post('/shop/signup', accessController.signUp)


module.exports = router