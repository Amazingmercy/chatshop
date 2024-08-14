const mongoose = require('mongoose');
const { Schema } = mongoose;


// Define the User schema
const userSchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
    trim: true,
  },
  email: {
    type: String,
    maxlength: 50,
    trim: true,
  },
  businessName: {
    type: String,
    maxlength: 50,
    trim: true,
  },
  whatsAppBussinessLink: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  password: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
});



// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
