const { dockStart } = require('@nlpjs/basic');
const Products = require('./models/productModel');

const setupNlp = async () => {
  const dock = await dockStart({ use: ['Basic'] });
  const manager = dock.get('nlp');

  manager.addLanguage('en');


  // Price Inquiry Intents
  const priceIntents = [
    'how much is a ',
    'I want to buy a ',
    'I want to buy ',
    'can i get a ',
    'what is the price of ',
    'can you tell me the cost of ',
    'price of ',
    'tell me the cost of ',
    'price for ',
    'how much does  cost',
    'what\'s the price for ',
    'can you give me the price of ',
    'how much do you charge for ',
    'how much would I pay for ',
    'what is the cost of ',
    'give me the price for ',
    'what do you sell  for',
    'I need to know the price of ',
    'quote me the price of ',
  ];

  for (const intent of priceIntents) {
    manager.addDocument('en', intent, 'inquire_price');
  }

  // Item Selection Intents
  const selectIntents = [
    'I want the ',
    'I want ',
    'I would like the ',
    'Yes I want this ',
    'I would like to order the ',
    'please give me the ',
    'I need the ',
    'give me ',
    'send ',
    'Do you have ',
    'can I get the ',
    'order  for me',
    'I\'ll take the ',
    'reserve  for me',
    'get me ',
    'can you provide ',
    'bring me the ',
    'i am interested in ',
    'I am buying ',
    'I would like to buy ',
    'can I get a ',
  ];

  for (const intent of selectIntents) {
    manager.addDocument('en', intent, 'select_item');
  }

  // General Inquiry Intents
  const inquiryIntents = [
    'What products do you have?',
    'What item do you have',
    'which product is available',
    'what can I get',
    'list all items',
    'what is available',
  ];

  for (const intent of inquiryIntents) {
    manager.addDocument('en', intent, 'inquiry');
  }

  // End Conversation Intents
  const endConversationIntents = [
    'Thank you for helping out',
    'Thanks',
    'Later',
    'Thank you',
    'Alright, next time',
    'I have found the vendor',
  ];

  for (const intent of endConversationIntents) {
    manager.addDocument('en', intent, 'end_conversation');
  }

  // Greetings Intents
  const greetingIntents = [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 
    'good day', 'howdy', 'hi there', 'what\'s up', 'how are you', 
    'how\'s it going', 'greetings', 'nice to meet you', 'pleasure to meet you', 
    'hey there', 'good to see you', 'how are things', 'what\'s going on', 'yo', 
    'how\'s life'
  ];

  for (const intent of greetingIntents) {
    manager.addDocument('en', intent, 'greeting');
  }

  // Answers for Greetings
  manager.addAnswer('en', 'greeting', 'Hello! How can I assist you today?');
  manager.addAnswer('en', 'greeting', 'Hey there! What can I do for you?');
  manager.addAnswer('en', 'greeting', 'Good morning! How may I help you?');

  // Answers for Price Inquiries
  manager.addAnswer('en', 'inquire_price', 'What kind are you interested in?');
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

  // Answers for Item Selection
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

  // Answers for Inquiry
  manager.addAnswer('en', 'inquiry', 'Here is a list of products we offer.');
  manager.addAnswer('en', 'inquiry', 'We have these products available:');
  manager.addAnswer('en', 'inquiry', 'Take a look at our product collection.');

  // Answers for End Conversation
  manager.addAnswer('en', 'end_conversation', 'You\'re welcome.');
  manager.addAnswer('en', 'end_conversation', 'Bye, do shop with us again.');
  manager.addAnswer('en', 'end_conversation', 'Glad I could help.');

  // Train the model
  await manager.train();
  manager.save(); // Save the model after training

  
  return manager;
};

module.exports = setupNlp;
