const express = require('express')
const router = express.Router()
const {handleIncomingMessage, verifyWebhook} = require('../controller/whatsappController')
const {testSendMessage, testIncomingMessages} = require('../test')







router.route('/webhook').post(handleIncomingMessage)
router.route('/webhook').get(verifyWebhook)
router.route('/test').post(handleIncomingMessage)








module.exports = router;