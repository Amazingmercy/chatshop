require('dotenv').config();
const Product = require('../models/productModel');
const axios = require('axios')
const setupNlp = require('../nlp')



const handleProductSelection = async (res, recipient, response) => {
  const productEntity = response.entities.find(entity => entity.entity === 'product');
  const productName = productEntity ? productEntity.option : null;

  if (productName == null) {
    let responseMessage = 'Please select a product from the list, Sorry, we don\'t have that at the moment'
    await sendTextMessage(res, recipient, responseMessage);
  }

  const products = await Product.find({ name: new RegExp(productName, 'i') }).populate('userId');

  if (products.length > 0) {
    let responseMessage = response.answer + ` ${productName}\n`;
    for (const product of products) {
      const vendor = product.userId;
      responseMessage += `\nVendor: ${vendor.businessName}\nContact: ${vendor.whatsAppBussinessLink}\n`;
    }
    await sendTextMessage(res, recipient, responseMessage);
  } else {
    await sendTextMessage(res, recipient, `Sorry, we don't have ${productName} at the moment.`);
  }
};




const handleProductInquiry = async (res, recipient, response) => {
  const productEntity = response.entities.find(entity => entity.entity === 'product');
  const productName = productEntity ? productEntity.option : 'products';

  const products = await Product.find({ name: new RegExp(productName, 'i') }).populate('userId');

  if (productName !== 'products') {
    for (const product of products) {
      // Reset responseMessage for each product to avoid accumulating product data
      let responseMessage = `${response.answer}\nProduct: ${product.name}\nPrice: $${product.price}\nVendor: ${product.userId.businessName}\nLink: ${product.userId.whatsAppBussinessLink}\n`;

      // Send the image first, if available
      if (product.picture_url) {
        const imageUrl = product.picture_url;
        await sendImageMessage(res, recipient, imageUrl);
      }

      // Send the text message after the image
      await sendTextMessage(res, recipient, responseMessage);
    }
  } else {
    let responseMessage = 'We do not have that right now, Here\'s what we have';
    await sendTextMessage(res, recipient, responseMessage);

    const allProducts = await Product.distinct('name');
    for (const productName of allProducts) {
      // Find each product
      const product = await Product.findOne({ name: productName });

      // Reset responseMessage for each product to avoid accumulation
      responseMessage = `\nProduct: ${product.name}\nPrice: $${product.price}\n`;

      if (product.picture_url) {
        const imageUrl = product.picture_url;
        await sendImageMessage(res, recipient, imageUrl);
      }

      await sendTextMessage(res, recipient, responseMessage);
    }
  }
};


const handleGreeting = async (res, recipient, response) => {
  try {
    const greetingMessage = response.answer;
    await sendTextMessage(res, recipient, greetingMessage);
  } catch (error) {
    await sendTextMessage(res, recipient, 'There was an error processing your request. Please try again later.');
  }

}


const handleEndConversation = async (res, recipient, response) => {
  try {
    const responseMessage = response.answer;
    await sendTextMessage(res, recipient, responseMessage);
  } catch (error) {
    await sendTextMessage(res, recipient, 'There was an error processing your request. Please try again later.');
  }

}



const sendTextMessage = async (res, recipient, message) => {
  try {
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

  } catch (error) {
    console.log(error)
    throw new Error('Error sending message');
  }
};


const sendImageMessage = async (res, recipient, imageUrl) => {
  try {

    const imagePayload = {
      messaging_product: 'whatsapp',
      to: recipient,
      type: "image",
      image: { link: imageUrl },  // Image URL link
    };


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


  } catch (error) {
    console.log(error)
    throw new Error('Error sending message');
  }
};






const handleIncomingMessage = async (req, res) => {
  try {
    const incomingMessage = req.body.entry[0].changes[0].value.messages.text.body;
    const from = req.body.entry[0].changes[0].value.messages.from;

    
    const manager = await setupNlp();
    const response = await manager.process('en', incomingMessage);
    
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
  sendTextMessage,
  sendImageMessage,
  verifyWebhook
}