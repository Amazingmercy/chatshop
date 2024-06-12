const axios = require('axios')
require('dotenv').config();


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
      console.log('Error sending message:', error);
    }
  }
  
  


const recipient = '09081513958'; // Replace with the actual recipient's WhatsApp number
const message = 'Test message from sendMessage function';

sendMessage(recipient, message);