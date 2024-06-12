const { dockStart } = require('@nlpjs/basic');

const setupNlp = async () => {
  const dock = await dockStart({ use: ['Basic'] });
  const manager = dock.get('nlp');

  manager.addLanguage('en');

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

  // Price Inquiry
  manager.addDocument('en', 'how much is a %item%', 'inquire_price');
  manager.addDocument('en', 'what is the price of %item%', 'inquire_price');
  manager.addDocument('en', 'can you tell me the cost of %item%', 'inquire_price');
  manager.addDocument('en', 'price of %item%', 'inquire_price');
  manager.addDocument('en', 'tell me the cost of %item%', 'inquire_price');
  manager.addDocument('en', 'price for %item%', 'inquire_price');

  // Item Selection
  manager.addDocument('en', 'I want the %item%', 'select_item');
  manager.addDocument('en', 'I would like to order the %item%', 'select_item');
  manager.addDocument('en', 'please give me the %item%', 'select_item');
  manager.addDocument('en', 'I need the %item%', 'select_item');
  manager.addDocument('en', 'give me %item%', 'select_item');
  manager.addDocument('en', 'send %item%', 'select_item');

  
  // Answers
  manager.addAnswer('en', 'greeting', 'Hello! How can I assist you today?');
  manager.addAnswer('en', 'inquire_price', 'Which item do you want?');
  manager.addAnswer('en', 'select_item', 'Ok great, chat the vendor up');
  manager.addAnswer('en', 'greeting', 'Hey there! What can I do for you?');
  manager.addAnswer('en', 'greeting', 'Good morning! How may I help you?')
  

  //Answers for price inquiries
  manager.addAnswer('en', 'inquire_price', 'Sure, what product are you interested in?');
  manager.addAnswer('en', 'inquire_price', 'Please specify the item you want to know the price for.');

  //Answers for item selection
  manager.addAnswer('en', 'select_item', 'Excellent choice! Contact the vendor for details.');
  manager.addAnswer('en', 'select_item', 'Got it! Reach out to the vendor for further assistance.');

  // Train the model
  await manager.train();

  return manager;
};

module.exports = setupNlp;
