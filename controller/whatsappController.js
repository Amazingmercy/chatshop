require('dotenv').config();
const Product = require('../models/productModel');
const User = require('../models/userModel')
const axios = require('axios')
const setupNlp = require('../nlp')



const handleProductSelection = async (res, recipient, response) => {
  const productEntity = response.entities.find(entity => entity.entity === 'product');
  const productName = productEntity ? productEntity.option : null;

  if (!productName) {
    await sendMessage(res, recipient, 'Sorry, I couldn\'t identify the product. Could you please specify the product name?');
    return;
  }

  const products = await Product.find({ name: new RegExp(productName, 'i') }).populate('userId');

  if (products.length > 0) {
    let responseMessage = `Here is a list of vendors that sell ${productName}:\n`;
    for (const product of products) {
      const vendor = product.userId;
      responseMessage += `\nVendor: ${vendor.businessName}\nContact: ${vendor.whatsAppBussinessLink}\n`;
    }
    await sendMessage(res, recipient, responseMessage);
  } else {
    await sendMessage(res, recipient, `Sorry, we don't have ${productName} at the moment.`);
  }
};




const handleProductInquiry = async (res, recipient, response) => {
  const productEntity = response.entities.find(entity => entity.entity === 'product');
  const productName = productEntity ? productEntity.option : 'products';

  
  const products = await Product.find({ name: new RegExp(productName, 'i') }).populate('userId');
  console.log(products)

  if (productName) {
    let responseMessage = `Okay great, here are the available ${productName}s:\n`;
    for (const product of products) {
      const vendor = product.userId;
      responseMessage += `\nProduct: ${product.name}\nPrice: $${product.price}\nVendor: ${vendor.businessName}\n`;
      if (product.picture_url) {
        const imageUrl = `${process.env.APP_URL}/uploads/${product.picture_url}`;
        await sendMessage(res, recipient, responseMessage, imageUrl);
      } else {
        await sendMessage(res, recipient, responseMessage);
      }
    }
  } else {
    const allProducts = await Product.distinct('name');
    let responseMessage = `Oh, we do not have that at the moment. Here are some available items:\n`;
    for (const productName of allProducts) {
      const product = await Product.findOne({ name: productName });
      responseMessage += `\nProduct: ${product.name}\nPrice: $${product.price}\n`;
      if (product.picture_url) {
        const imageUrl = `${process.env.BASE_URL}/uploads/${product.picture_url}`;
        await sendMessage(res, recipient, responseMessage, imageUrl);
      } else {
        await sendMessage(res, recipient, responseMessage);
      }
    }
  }
};

const handleGreeting = async (res, response, recipient) => {
  try {
    const greetingMessage = response.answer;
    await sendMessage(res, recipient, greetingMessage);
  } catch (error) {
    console.log('Error handling greeting:', error);
    await sendMessage(res, recipient, 'There was an error processing your request. Please try again later.');
  }

}


const handleEndConversation = async (res, response, recipient) => {
  try {
    const responseMessage = response.answer;
    await sendMessage(res, recipient, responseMessage);
  } catch (error) {
    console.log('Error handling greeting:', error);
    await sendMessage(res, recipient, 'There was an error processing your request. Please try again later.');
  }

}



const sendMessage = async (res, recipient, message, imageUrl = null) => {
  try {
    const messagePayload = {
      messaging_product: 'whatsapp',
      to: recipient,
      type: "text",
      text: { body: message },
    };

    if (imageUrl) {
      messagePayload.type = "image";
      messagePayload.image = { link: imageUrl };
    }

    await axios.post(
      `${process.env.WHATSAPP_API_URL}`,
      messagePayload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        },
      }
    );
    console.log('Message sent successfully:', message);
    res.status(200).json({ botResponse: message });
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
};







const handleIncomingMessage = async (req, res) => {
  try {
    const incomingMessage = req.body.entry[0].changes[0].value.messages[0].text.body;
    const from = req.body.entry[0].changes[0].value.messages[0].from;

    const manager = await setupNlp();
    const response = await manager.process('en', incomingMessage);
    
    
    switch (response.intent) {
      case 'greeting':
        await handleGreeting(res, from);
        break;
      case 'inquire_price':
        await handleProductInquiry(res, from, response);
        break;
      case 'select_item':
        await handleProductSelection(res, from, response);
        break;
      case 'end_conversation':
        await handleEndConversation(res, from);
        break;
      default:
        await sendMessage(res, from, "Sorry, I didn't understand that. Can you please rephrase?");
        break;
    }
  } catch (error) {
    console.log('Error handling incoming message:', error);
    res.status(500).json({ message: 'Error handling incoming message' });
};
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
  handleEndConversation,
  handleProductInquiry,
  handleProductSelection,
  handleIncomingMessage,
  sendMessage,
  verifyWebhook
}