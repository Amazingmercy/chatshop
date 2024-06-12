const {sendMessage, handleIncomingMessage} = require('./controller/whatsappController')


const testSendMessage = async (req, res) => {
  const { recipient, message } = req.body;
  try {
    await sendMessage(recipient, message);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    res.status(500).send('Failed to send message');
  }
}


const testIncomingMessages = async (req, res) => {
  const { incomingMessage, recipient } = req.body;
  try {
    await handleIncomingMessage(recipient, incomingMessage);
    res.status(200).send('message handled');
  } catch (error) {
    res.status(500).send('Failed to send message');
  }
}


module.exports = {
  testSendMessage,
  testIncomingMessages
}