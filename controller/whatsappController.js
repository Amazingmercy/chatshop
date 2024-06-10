require('dotenv').config();
const { Op } = require('sequelize');
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
const Product = require('../models/productModel');  



const handleInquiry = async (res, productKeyword) => {
  try {
    const results = await Product.find({
      name: new RegExp(productKeyword, 'i'),
    });

    if (results.length > 0) {
      let responseMessage = `Which ${productKeyword} do you want? Here are some options:\n`;
      results.forEach(product => {
        responseMessage += `\n${product.name} - ${product.price}\n${product.picture_url}\n`;
      });
      await sendMessage(res, responseMessage);
    } else {
      await sendMessage(res, `No ${productKeyword} found.`);
    }
  } catch (error) {
    console.error('Error querying database:', error);
    await sendMessage(res, 'There was an error processing your request. Please try again later.');
  }
};



const extractProductName = (incomingMessage) => {
  const words = incomingMessage.split(' '); // Split the message into words
  const productName = words[words.length - 1].trim(); // Product name is the last word, trimmed
  return productName;
};



const handleSelectItem = async (res, incomingMessage, response, recipient) => {
  try {
    const itemEntity = response.entities.find(entity => entity.entity === 'item');
    const productName = itemEntity ? itemEntity.option : extractProductName(incomingMessage);

    const product = await Product.findOne({
      name: new RegExp(productName, 'i'),
    });

    if (product) {
      await sendMessage(recipient, `Ok great, chat the vendor up: ${product.userId}`);
    } else {
      await sendMessage(recipient, 'Product not found.');
    }
  } catch (error) {
    console.error('Error querying database:', error)
    await sendMessage(recipient, 'There was an error processing your request. Please try again later.');
  } finally {
    res.writeHead(200, { 'Content-Type': 'text/xml' });
  }
};


const handleGreeting = async(res, recipient) => {
    try {
        const greetingMessage = 'Hello! How can I assist you today?';
        await sendMessage(recipient, greetingMessage);
    } catch (error) {
        console.error('Error handling greeting:', error);
        await sendMessage(recipient, 'There was an error processing your request. Please try again later.');
    } finally {
        res.writeHead(200, { 'Content-Type': 'text/xml' });
    }

}



const sendMessage = async(recipient, message) => {
  try {
    await axios.post(
      `${process.env.WHATSAPP_API_URL}/messages`,
      {
        messaging_product: 'whatsapp',
        to: recipient,
        text: { body: message },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        },
      }
    );
  } catch (error) {
    console.error('Error sending message:', error);
  }
}




const handleIncomingMessage = async(req, res) => {
  const incomingMessage = req.body.messages[0].text.body;
  const from = req.body.messages[0].from;

  console.log(`Received message from ${from}: ${incomingMessage}`);

  const response = await manager.process('en', incomingMessage);

  if (response.intent === 'greeting') {
    await handleGreeting(res, from);
  } else if (response.intent === 'inquire_price') {
    const productKeyword = 'product';
    await handleInquiry(res, from, productKeyword);
  } else if (response.intent === 'select_item') {
    await handleSelectItem(res, from, incomingMessage, response);
  } else {
    await sendMessage(from, 'Sorry, I did not understand that.');
    res.sendStatus(200);
  }
}



// Webhook verification
const verifyWebhook = async (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN

  console.log('Query object:', req.query);

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log(`Received webhook verification request: mode=${mode}, token=${token}, challenge=${challenge}`);

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log(challenge)
  } else {
    res.sendStatus(403)
    console.log("Unauthorized")
  }
}

  


module.exports = {
    handleGreeting,
    handleInquiry,
    handleSelectItem,
    handleIncomingMessage,
    sendMessage,
    verifyWebhook
}