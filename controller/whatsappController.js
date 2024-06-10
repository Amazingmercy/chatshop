require('dotenv').config();
const { MessagingResponse } = require('twilio').twiml;
const connectDB = require('../DB/config')
const query = (connectDB.query).bind(connectDB);
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });


const handleInquiry = async(res, twiml, productKeyword) => {
    try {
        const results = await query('SELECT * FROM products WHERE name LIKE ?', [`%${productKeyword}%`]);
        if (results.length > 0) {
          let responseMessage = `Which ${productKeyword} do you want? Here are some options:\n`;
          results.forEach(product => {
            responseMessage += `\n${product.name} - ${product.price}\n${product.picture_url}\n`;
          });
          twiml.message(responseMessage);
        } else {
          twiml.message(`No ${productKeyword} found.`);
        }
    } catch (error) {
        console.error('Error querying database:', error);
        twiml.message('There was an error processing your request. Please try again later.');
    } finally {
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    }

}


const handleSelectItem = async(res, twiml, incomingMessage, response) => {
    try {
        const itemEntity = response.entities.find(entity => entity.entity === 'item');
        const productName = itemEntity ? itemEntity.option : incomingMessage.split(' ').slice(2).join(' ');
    
        const productResults = await query('SELECT * FROM products WHERE name = ?', [productName]);
        if (productResults.length > 0) {
          const product = productResults[0];
          const vendorResults = await query('SELECT * FROM users WHERE id = ?', [product.userId]);
          if (vendorResults.length > 0) {
            const user = vendorResults[0];
            twiml.message(`Ok great, chat the vendor up: ${user.WhatsAppBussinessLink}`);
          } else {
            twiml.message('Vendor not found.');
          }
        } else {
          twiml.message('Product not found.');
        }
    } catch (error) {
        console.error('Error querying database:', error);
        twiml.message('There was an error processing your request. Please try again later.');
    } finally {
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString())
    }
}


const handleGreeting = async(res, twiml) => {
    try {
        const greetingMessage = 'Hello! How can I assist you today?';
        twiml.message(greetingMessage);
    } catch (error) {
        console.error('Error handling greeting:', error);
        twiml.message('There was an error processing your request. Please try again later.');
    } finally {
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    }

}



const sendMessage = async(to, body) => {
  try {
    await axios.post(
      `${process.env.WHATSAPP_API_URL}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        text: { body },
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
    const itemEntity = response.entities.find(entity => entity.entity === 'item');
    const productKeyword = itemEntity ? itemEntity.option : 'product';
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

  console.log('Query object:', req);

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