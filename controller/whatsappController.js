require('dotenv').config();
const Product = require('../models/productModel');
const User = require('../models/userModel')
const axios = require('axios')
const setupNlp = require('../nlp')



const handleProductSelection = async (res, recipient, response) => {
  const productEntity = response.entities.find(entity => entity.entity === 'product');
  const productName = productEntity ? productEntity.option : null;

  if (productName == null) {
    let responseMessage = 'Please select a product from the list, Sorry, we don\'t have that at the moment'
    await sendMessage(res, recipient, responseMessage);
  }

  const products = await Product.find({ name: new RegExp(productName, 'i') }).populate('userId');

  if (products.length > 0) {
    let responseMessage = response.answer + ` ${productName}\n`;
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

  if (productName != 'products') {
    let responseMessage = response.answer + `${productName}`;
    for (const product of products) {
      responseMessage += `\nProduct: ${product.name}\nPrice: $${product.price}\nVendor: ${product.userId.businessName}\n Link: ${product.userId.whatsAppBussinessLink}`;
      if (product.picture_url) {
        const imageUrl = `${process.env.APP_URL}/static/uploaded_img/${product.picture_url}`;
        await sendMessage(res, recipient, responseMessage, imageUrl);
      } else {
        await sendMessage(res, recipient, responseMessage);
      }
    }
  } else {
    const allProducts = await Product.distinct('name');
    let responseMessage = `Oh, we do not have that at the moment. Here are some available items:\n`;
    let imageUrl = null; 
  
    for (const productName of allProducts) {
      const product = await Product.findOne({ name: productName });
      responseMessage += `\nProduct: ${product.name}\nPrice: $${product.price}\n`;
  
      // If this product has an image, store the image URL (you can choose to keep only the last product's image or the first one)
      if (product.picture_url && !imageUrl) {
        imageUrl = `${process.env.APP_URL}/static/uploaded_img/${product.picture_url}`;
      }
    }
    await sendMessage(res, recipient, responseMessage, imageUrl);
  }
  
};

const handleGreeting = async (res, recipient, response) => {
  try {
    const greetingMessage = response.answer;
    console.log(response.answer)
    await sendMessage(res, recipient, greetingMessage);
  } catch (error) {
    console.log('Error handling greeting:', error);
    await sendMessage(res, recipient, 'There was an error processing your request. Please try again later.');
  }

}


const handleEndConversation = async (res, recipient, response) => {
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
    // First, send the text message if it exists
      const textPayload = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: "text",
        text: { body: message },  // For text messages
      };

      await axios.post(
        process.env.WHATSAPP_API_URL,
        textPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          },
        }
      );

    // Then, send the image if an imageUrl is provided
    if (imageUrl) {
      const imagePayload = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: "image",
        image: { link: imageUrl },  // Image URL link
      };

      console.log(imageUrl.link)

      await axios.post(
        process.env.WHATSAPP_API_URL,
        imagePayload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          },
        }
      );
    }

  } catch (error) {
    console.error(
      'Error sending message:',
      error.response && error.response.data
        ? error.response.data
        : error.message
    );
    throw new Error('Error sending message');
  }
};








const handleIncomingMessage = async (req, res) => {
  try {
    const incomingMessage = req.body.entry[0].changes[0].value.messages[0].text.body;
    const from = req.body.entry[0].changes[0].value.messages[0].from;

    const manager = await setupNlp();
    const response = await manager.process('en', incomingMessage);
    console.log(response.answer)
    
    switch (response.intent) {
      case 'greeting':
        await handleGreeting(res, from, response);
        break;
      case 'inquire_price':
        await handleProductInquiry(res, from, response);
        break;
      case 'select_item':
        await handleProductSelection(res, from, response);
        break;
      case 'end_conversation':
        await handleEndConversation(res, from, response);
        break;
      default:
        await sendMessage(res, from, "Sorry, I didn't understand that. Can you please rephrase?");
        break;
    }
    res.status(200).json({ message: 'Request handled successfully' });
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