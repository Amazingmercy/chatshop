const { NlpManager } = require('node-nlp');
const Products = require('./models/productModel');

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

  // Product Inquiry Intents
  manager.addDocument('en', 'I want to buy a %product%', 'inquire_price');
  manager.addDocument('en', 'can I buy a %product%', 'inquire_price');

  // Product Selection Intents
  manager.addDocument('en', 'I want the %product%', 'select_item');
  manager.addDocument('en', 'I would like the %product%', 'select_item');

  // End Conversation Intents
  manager.addDocument('en', 'Thank you', 'end_conversation');
  manager.addDocument('en', 'Thanks', 'end_conversation');

  // Greeting Responses
  manager.addAnswer('en', 'greeting', 'Hi, how can I help?');

  // Product Inquiry Responses
  manager.addAnswer('en', 'inquire_price', 'Sure! Let me find what we have for %product%.');

  // Product Selection Responses
  manager.addAnswer('en', 'select_item', 'Great choice! Let me show you the vendors for %product%.');

  // End Conversation Responses
  manager.addAnswer('en', 'end_conversation', 'You\'re welcome!');

  // Train the model
  await manager.train();
  manager.save(); // Save the model after training

  return manager;
};

module.exports = setupNlp;
