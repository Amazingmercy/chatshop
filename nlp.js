const { NlpManager } = require('node-nlp');
const Products = require('./models/productModel');
const User = require('./models/userModel');

const setupNlp = async () => {
  const manager = new NlpManager({ languages: ['en'], forceNER: true });

  // Fetch products from the database and add them as entities
  const products = await Products.find();
  products.forEach(product => {
    manager.addNamedEntityText('product', product.name, ['en'], [product.name]);
  });

  // Greeting Intents
  manager.addDocument('en', 'hello', 'greeting');
  manager.addDocument('en', 'hi', 'greeting');
  manager.addDocument('en', 'hey', 'greeting');
  manager.addDocument('en', 'good morning', 'greeting');  // New greeting
  manager.addDocument('en', 'good afternoon', 'greeting');  // New greeting
  manager.addDocument('en', 'good evening', 'greeting');  // New greeting
  manager.addDocument('en', 'how are you', 'greeting');  // New greeting
  manager.addDocument('en', 'what\'s up', 'greeting');  // New greeting

  // Product Inquiry Intents
  manager.addDocument('en', 'I want to buy a %product%', 'inquire_price');
  manager.addDocument('en', 'can I buy a %product%', 'inquire_price');
  manager.addDocument('en', 'I want to get something', 'inquire_price');
  manager.addDocument('en', 'What\'s the price of %product%', 'inquire_price');  // New inquiry
  manager.addDocument('en', 'How much is the %product%', 'inquire_price');  // New inquiry
  manager.addDocument('en', 'Do you have any %product% in stock?', 'inquire_price');  // New inquiry
  manager.addDocument('en', 'Is the %product% available?', 'inquire_price');  // New inquiry
  manager.addDocument('en', 'What are the available products?', 'inquire_price');  // New inquiry
  manager.addDocument('en', 'What else do you have?', 'inquire_price');  // New inquiry
  manager.addDocument('en', 'Give me another product', 'inquire_price');  // New inquiry
  manager.addDocument('en', 'I want another %product%', 'inquire_price');  // New inquiry

  // Product Selection Intents
  manager.addDocument('en', 'I want the %product%', 'select_item');
  manager.addDocument('en', 'I would like the %product%', 'select_item');
  manager.addDocument('en', 'Please give me the %product%', 'select_item');  // New selection
  manager.addDocument('en', 'Can you get me the %product%', 'select_item');  // New selection
  manager.addDocument('en', 'I need the %product%', 'select_item');  // New selection
  manager.addDocument('en', 'I want %product%', 'select_item');  // New selection

  // End Conversation Intents
  manager.addDocument('en', 'Thank you', 'end_conversation');
  manager.addDocument('en', 'Thanks', 'end_conversation');
  manager.addDocument('en', 'That\'s all for now', 'end_conversation');  // New end conversation
  manager.addDocument('en', 'Bye', 'end_conversation');  // New end conversation
  manager.addDocument('en', 'Goodbye', 'end_conversation');  // New end conversation

  // Greeting Responses
  manager.addAnswer('en', 'greeting', 'Hi, how can I help?');
  manager.addAnswer('en', 'greeting', 'Hello! How may I assist you today?');
  manager.addAnswer('en', 'greeting', 'Hey there! How can I help you today?');
  manager.addAnswer('en', 'greeting', 'Good to see you! What do you need assistance with?');
  manager.addAnswer('en', 'greeting', 'Hi! What can I do for you today?');

  // Product Inquiry Responses
  manager.addAnswer('en', 'inquire_price', 'Sure! Let me find what we have for ');
  manager.addAnswer('en', 'inquire_price', 'Let me check the price for ');
  manager.addAnswer('en', 'inquire_price', 'I\'ll show you the prices for ');
  manager.addAnswer('en', 'inquire_price', 'We have several options for ');
  manager.addAnswer('en', 'inquire_price', 'I\'m checking the availability of ');

  // Product Selection Responses
  manager.addAnswer('en', 'select_item', 'Great choice! Let me show you the vendors for ');
  manager.addAnswer('en', 'select_item', 'You\'ve picked a great item! I\'ll show you where to buy ');
  manager.addAnswer('en', 'select_item', 'Perfect! Here are the sellers for ');
  manager.addAnswer('en', 'select_item', 'That\'s a good selection! I\'ll display the available options for ');
  manager.addAnswer('en', 'select_item', 'Let me find the vendors for your choice of ');

  // End Conversation Responses
  manager.addAnswer('en', 'end_conversation', 'You\'re welcome!');
  manager.addAnswer('en', 'end_conversation', 'Glad to help!');
  manager.addAnswer('en', 'end_conversation', 'Have a great day!');
  manager.addAnswer('en', 'end_conversation', 'Take care!');
  manager.addAnswer('en', 'end_conversation', 'Goodbye!');

  // Train the model
  await manager.train();
  manager.save(); // Save the model after training

  return manager;
};

module.exports = setupNlp;
