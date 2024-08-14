const { dockStart } = require('@nlpjs/basic');
const connectDB = require('./DB/config')
const DB_URI = process.env.MONGO_URI
const Product = require('./models/productModel')

const setupNlp = async () => {
  const dock = await dockStart({ use: ['Basic'] });
  const manager = dock.get('nlp');

  manager.addLanguage('en');

  await connectDB(DB_URI)
  //const products = await Product.find()

  const items = ['bag', 'shoes', 'shirt'];

  manager.addNerBetweenCondition('en', 'item', 'the', undefined);
  items.forEach(item => {
    manager.addNerRegexRule('en', 'item', new RegExp(item, 'gi'));
  });

  // Greetings
  manager.addDocument('en', 'hello', 'greeting');
  manager.addDocument('en', 'hi', 'greeting');
  manager.addDocument('en', 'hey', 'greeting');
  manager.addDocument('en', 'good morning', 'greeting');
  manager.addDocument('en', 'good afternoon', 'greeting');
  manager.addDocument('en', 'good evening', 'greeting');
  manager.addDocument('en', 'good day', 'greeting');
  manager.addDocument('en', 'howdy', 'greeting');
  manager.addDocument('en', 'hi there', 'greeting');
  manager.addDocument('en', 'what\'s up', 'greeting');
  manager.addDocument('en', 'how are you', 'greeting');
  manager.addDocument('en', 'how\'s it going', 'greeting');
  manager.addDocument('en', 'greetings', 'greeting');
  manager.addDocument('en', 'nice to meet you', 'greeting');
  manager.addDocument('en', 'pleasure to meet you', 'greeting');
  manager.addDocument('en', 'hey there', 'greeting');
  manager.addDocument('en', 'good to see you', 'greeting');
  manager.addDocument('en', 'how are things', 'greeting');
  manager.addDocument('en', 'what\'s going on', 'greeting');
  manager.addDocument('en', 'yo', 'greeting');
  manager.addDocument('en', 'how\'s life', 'greeting');


  // Price Inquiry
  manager.addDocument('en', 'how much is a %item%', 'inquire_price');
  manager.addDocument('en', 'what is the price of %item%', 'inquire_price');
  manager.addDocument('en', 'can you tell me the cost of %item%', 'inquire_price');
  manager.addDocument('en', 'price of %item%', 'inquire_price');
  manager.addDocument('en', 'tell me the cost of %item%', 'inquire_price');
  manager.addDocument('en', 'price for %item%', 'inquire_price');
  manager.addDocument('en', 'how much does %item% cost', 'inquire_price');
  manager.addDocument('en', 'what\'s the price for %item%', 'inquire_price');
  manager.addDocument('en', 'can you give me the price of %item%', 'inquire_price');
  manager.addDocument('en', 'how much do you charge for %item%', 'inquire_price');
  manager.addDocument('en', 'how much would I pay for %item%', 'inquire_price');
  manager.addDocument('en', 'what is the cost of %item%', 'inquire_price');
  manager.addDocument('en', 'give me the price for %item%', 'inquire_price');
  manager.addDocument('en', 'what do you sell %item% for', 'inquire_price');
  manager.addDocument('en', 'I need to know the price of %item%', 'inquire_price');
  manager.addDocument('en', 'quote me the price of %item%', 'inquire_price');


  // Item Selection
  manager.addDocument('en', 'I want the %item%', 'select_item');
  manager.addDocument('en', 'I would like to order the %item%', 'select_item');
  manager.addDocument('en', 'please give me the %item%', 'select_item');
  manager.addDocument('en', 'I need the %item%', 'select_item');
  manager.addDocument('en', 'give me %item%', 'select_item');
  manager.addDocument('en', 'send %item%', 'select_item');
  manager.addDocument('en', 'I want to buy %item%', 'select_item');
  manager.addDocument('en', 'I want %item%', 'select_item');
  manager.addDocument('en', 'Do you have %item%', 'select_item');
  manager.addDocument('en', 'can I get the %item%', 'select_item');
  manager.addDocument('en', 'order %item% for me', 'select_item');
  manager.addDocument('en', 'I\'ll take the %item%', 'select_item');
  manager.addDocument('en', 'reserve %item% for me', 'select_item');
  manager.addDocument('en', 'I would like %item%', 'select_item');
  manager.addDocument('en', 'get me %item%', 'select_item');
  manager.addDocument('en', 'can you provide %item%', 'select_item');
  manager.addDocument('en', 'bring me the %item%', 'select_item');
  manager.addDocument('en', 'I am interested in %item%', 'select_item');
  manager.addDocument('en', 'I am buying %item%', 'select_item');
  manager.addDocument('en', 'I would like to buy %item%', 'select_item');
  manager.addDocument('en', 'Can I get a %item%', 'select_item');


  // Answers
  manager.addAnswer('en', 'greeting', 'Hello! How can I assist you today?');
  manager.addAnswer('en', 'inquire_price', 'Which item do you want?');
  manager.addAnswer('en', 'select_item', 'Ok great, chat the vendor up');
  manager.addAnswer('en', 'greeting', 'Hey there! What can I do for you?');
  manager.addAnswer('en', 'greeting', 'Good morning! How may I help you?')

  //Answers for price inquiries
  manager.addAnswer('en', 'inquire_price', 'what kind are you interested in?');
  manager.addAnswer('en', 'inquire_price', 'Please specify the item you want.');
  manager.addAnswer('en', 'inquire_price', 'Can you tell me which product you\'re asking about?');
  manager.addAnswer('en', 'inquire_price', 'I can help with that! Which item are you referring to?');
  manager.addAnswer('en', 'inquire_price', 'Which specific product are you inquiring about?');
  manager.addAnswer('en', 'inquire_price', 'Please let me know the name of the item you\'re interested in.');
  manager.addAnswer('en', 'inquire_price', 'Could you specify the product you\'re asking about?');
  manager.addAnswer('en', 'inquire_price', 'Which item would you like the price for?');
  manager.addAnswer('en', 'inquire_price', 'I need to know the exact product you want to check.');
  manager.addAnswer('en', 'inquire_price', 'Can you provide the name of the item you\'re interested in?');
  manager.addAnswer('en', 'inquire_price', 'Please provide the name of the product you want to know the price of.');
  manager.addAnswer('en', 'inquire_price', 'Which item\'s price are you looking for?');


  //Answers for item selection
  manager.addAnswer('en', 'select_item', 'Excellent choice! Contact the vendor for details.');
  manager.addAnswer('en', 'select_item', 'Got it! Reach out to the vendor for further assistance.');
  manager.addAnswer('en', 'select_item', 'Great pick! You can contact the vendor for more information.');
  manager.addAnswer('en', 'select_item', 'Awesome! Please get in touch with the vendor for details.');
  manager.addAnswer('en', 'select_item', 'Nice choice! The vendor will assist you with the rest.');
  manager.addAnswer('en', 'select_item', 'Perfect! The vendor is available for any further questions.');
  manager.addAnswer('en', 'select_item', 'Good choice! You can now contact the vendor to proceed.');
  manager.addAnswer('en', 'select_item', 'That\'s a great selection! The vendor will help you out from here.');
  manager.addAnswer('en', 'select_item', 'You\'ve selected well! Get in touch with the vendor for more.');
  manager.addAnswer('en', 'select_item', 'Understood! The vendor is ready to assist you further.');
  manager.addAnswer('en', 'select_item', 'Great! Please contact the vendor for any additional details.');
  manager.addAnswer('en', 'select_item', 'Fantastic choice! The vendor will guide you with the next steps.');


  // Train the model
  await manager.train();

  return manager;
};

module.exports = setupNlp;