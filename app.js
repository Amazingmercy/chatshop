require('dotenv').config();
const express = require('express')
const { NlpManager } = require('node-nlp');
const connectDB = require('./DB/config')
const DB_URI = process.env.MONGO_URI
const WhatsappMessages = require('./routes/whatsappRoutes')

const app = express();
app.use(express.json())


const manager = new NlpManager({ languages: ['en'] });

manager.addDocument('en', 'hello', 'greeting');
manager.addDocument('en', 'hi', 'greeting');
manager.addDocument('en', 'how much is a %item%', 'inquire_price');
manager.addDocument('en', 'I want the %item%', 'select_item');
// Add more training data as needed

manager.addAnswer('en', 'greeting', 'Hello! How can I assist you today?');
manager.addAnswer('en', 'inquire_price', 'Which item do you want?');
manager.addAnswer('en', 'select_item', 'Ok great, chat the vendor up');


app.use('/whatsapp',WhatsappMessages)






const port = process.env.PORT || 4501;
const start = async () => {
    try{
        await connectDB(DB_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`));
    } catch (error){
        console.log(error);
    }
    
}

start()