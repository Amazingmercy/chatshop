require('dotenv').config();
const Product = require('../models/productModel'); 
const User = require('../models/userModel') 
const axios = require('axios')
const setupNlp = require('../nlp')



const handleInquiry = async (res, response, recipient, productKeyword) => {
  try {
    const results = await Product.find({
      name: new RegExp(productKeyword, 'i'),
    });

    if (results.length > 0) {
      let responseMessage = response.answer;
      results.forEach(product => {
        responseMessage += `\n${product.name} - ${product.price}\n${product.picture_url}\n`;
      });
      await sendMessage(res, recipient, responseMessage);
      res.status(200)
    } else {
      await sendMessage(res, recipient, `${productKeyword} is not available.`);
      res.status(200)
    }
  } catch (error) {
    console.log('Error querying database:', error);
    await sendMessage(res, recipient, 'There was an error processing your request. Please try again later.');
  }
};

const extractProductName = (incomingMessage) => {
  const words = incomingMessage.split(' '); // Split the message into words
  const productName = words[words.length - 1].trim(); // Product name is the last word, trimmed
  return productName;
};

const handleSelectItem = async (res, recipient, incomingMessage, response) => {
  try {
    const itemEntity = response.entities
    console.log(itemEntity)
    const productName = itemEntity ? itemEntity.option : extractProductName(incomingMessage);

    const results = await Product.findOne({
      name: new RegExp(productName, 'i'),
    });
  
    if (results) {
      let responseMessage = response.answer;
      for (const product of results) {
          const user = await User.findById(product.userId);
          responseMessage += `\n${user.WhatsAppBussinessLink}\n`;
      }
      await sendMessage(res,recipient, responseMessage);
      res.status(200).json({message: 'Product  found'})
    } else {
      await sendMessage(res,recipient, 'Product not found.');
      res.status(200).json({message: 'Product not found'})
    }
  } catch (error) {
    console.log('Error querying database:', error)
    await sendMessage(res,recipient, 'There was an error processing your request. Please try again later.');
  }
};

const handleGreeting = async(res,response, recipient) => {
    try {
        const greetingMessage = response.answer;
        await sendMessage(res, recipient, greetingMessage);
        res.status(200).json({message: 'Greeting responded'})
    } catch (error) {
        console.log('Error handling greeting:', error);
        await sendMessage(res, recipient, 'There was an error processing your request. Please try again later.');
    }

}


const sendMessage = async(res, recipient, message) => {
  try {
    await axios.post(
      `${process.env.WHATSAPP_API_URL}`,
      {
        messaging_product: 'whatsapp',
        to: recipient,
        type: "text",
        text: { 
          body: 
            message 

          },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        },
      }
    )
  } catch (error) {
    console.log('Error sending message:', error);
    res.status(500).json({message: 'Error sending message'})
  }
}




const handleIncomingMessage = async (req, res) => {
  try {
    const incomingMessageMain = req.body.entry[0].changes[0].value.messages[0].text.body;
    const incomingMessage = (incomingMessageMain).toLowerCase()
    const from = req.body.entry[0].changes[0].value.messages[0].from

    console.log(incomingMessageMain)
    // const incomingMessage = req.body.message.toLowerCase()
    // const from = req.body.recipien
    const manager = await setupNlp();

    const response = await manager.process('en', incomingMessage);
    console.log(response);


    if (response.intent === 'greeting') {
      await handleGreeting(res, response, from);
    } else if (response.intent === 'inquire_price') {
      const productKeyword = 'product';
      await handleInquiry(res, response, from, productKeyword);
    } else if (response.intent === 'select_item') {
      await handleSelectItem(res,from, incomingMessage, response);
    } else {
      await sendMessage(from, 'Sorry, I did not understand that.');
    }

  } catch (error) {
    console.log('Error handling incoming message:', error);
    res.status(500).json({message: 'Error handling incoming message:'})
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