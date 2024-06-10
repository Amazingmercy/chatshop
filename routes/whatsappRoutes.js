const express = require('express')
const router = express.Router()
const Whatsapp = require('../controller/whatsappController')




router.route('/message').post(Whatsapp.handleIncomingMessage)
router.route('/webhook').get(Whatsapp.verifyWebhook)
router.route('/').post(Whatsapp.sendMessage)







module.exports = router;