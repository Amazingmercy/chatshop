const mongoose = require('mongoose');
const { Schema } = mongoose;



const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  picture_url: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;