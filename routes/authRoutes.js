const express = require('express')
const router = express.Router()
const {register, login, logout, viewHome, viewLogin} = require('../controller/authController')


router.route('/register').post(register)
router.route('/').get(viewHome)
router.route('/login').post(login)
router.route('/login').get(viewLogin)
router.route('/logout').get(logout)



module.exports = router