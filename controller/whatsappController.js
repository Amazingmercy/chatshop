require('dotenv').config();
const Product = require('../models/productModel');
const User = require('../models/userModel')
const axios = require('axios')
const setupNlp = require('../nlp')

const extractProductName = (incomingMessage) => {
  const match = incomingMessage.match(/(?:buy|get|want|need|order|price of|cost of)\s+([\w\s]+)/i);
  return match ? match[1].trim() : null;
};

const handleInquiryPrice = async (res, response, recipient) => {
    try {
      const responseMessage = response.answer;
      await sendMessage(res, recipient, responseMessage);
    } catch (error) {
      console.log('Error handling greeting:', error);
      await sendMessage(res, recipient, 'There was an error processing your request. Please try again later.');
    }
};



const handleInquiry = async (res, recipient, response) => {
  try {
    const allProducts = await Product.distinct('name');
    
    const uniqueProducts = await Product.find({
      name: { $in: allProducts }
    });
    

    if (uniqueProducts && uniqueProducts.length > 0) {
      let responseMessage = response.answer;
      uniqueProducts.forEach(product => {
        responseMessage += `\n${product.name} - ${product.price}`;
      });
      await sendMessage(res, recipient, responseMessage);
    } else {
      await sendMessage(res, recipient, 'There is no products available right now');
    }
  } catch (error) {
    console.log('Error handling greeting:', error);
    await sendMessage(res, recipient, 'There was an error processing your request. Please try again later.');
  }

};


const handleSelectItem = async (res, recipient, incomingMessage, response) => {
  try {
    const itemEntity = response.entities.find(entity => entity.entity === 'item');
    const productName = itemEntity ? itemEntity.option : extractProductName(incomingMessage);


    console.log(productName)
    // Find all products matching the name (using RegExp for case-insensitive search)
    const allProducts = await Product.find({
      name: new RegExp(productName, 'i'),
    });


    if (allProducts && allProducts.length > 0) {
      let responseMessage = response.answer;
      for (const product of allProducts) {
        const user = await User.findById(product.userId);
        responseMessage += `\n${user.whatsAppBussinessLink}\n`;
      }
      await sendMessage(res, recipient, responseMessage);
    } else {
      await sendMessage(res, recipient, 'Product not found.');
    }
  } catch (error) {
    console.log('Error querying database:', error)
    await sendMessage(res, recipient, 'There was an error processing your request. Please try again later.');
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


const handleEndCoversation = async (res, response, recipient) => {
  try {
    const responseMessage = response.answer;
    await sendMessage(res, recipient, responseMessage);
  } catch (error) {
    console.log('Error handling greeting:', error);
    await sendMessage(res, recipient, 'There was an error processing your request. Please try again later.');
  }

}



const sendMessage = async (res, recipient, message) => {
  try {
    await axios.post(
      `${process.env.WHATSAPP_API_URL}`,
      {
        messaging_product: 'whatsapp',
        to: recipient,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        },
      }
    );
    console.log('Message sent successfully:', message);
    res.status(200).json({ botResponse: message })
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
};





const handleIncomingMessage = async (req, res) => {
  try {
    const incomingMessageMain = req.body.entry[0].changes[0].value.messages[0].text.body;
    const incomingMessage = (incomingMessageMain).toLowerCase()
    const from = req.body.entry[0].changes[0].value.messages[0].from


    const manager = await setupNlp();

    const response = await manager.process('en', incomingMessage);
    console.log(response.intent, response.entities)

    if (response.intent === 'greeting') {
      await handleGreeting(res, response, from);
    } else if (response.intent === 'inquire_price') {
      await handleInquiryPrice(res, response, from);
    } else if (response.intent === 'select_item') {
      await handleSelectItem(res, from, incomingMessage, response);
    } else if (response.intent === 'end_conversation') {
      await handleEndCoversation(res, response, from);
    } else if (response.intent === 'inquiry') {
      await handleInquiry(res, from, response);
    } else {
      await sendMessage(res, from, 'Sorry, I did not understand that.');
    }

  } catch (error) {
    console.log('Error handling incoming message:', error);
    res.status(500).json({ message: 'Error handling incoming message:' })
  }
};




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