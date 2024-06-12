const express = require('express')
const router = express.Router()
const Whatsapp = require('../controller/whatsappController')




router.route('/webhook').post(Whatsapp.handleIncomingMessage)
router.route('/webhook').get(Whatsapp.verifyWebhook)







module.exports = router;