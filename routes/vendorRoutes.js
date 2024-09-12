const express = require('express');
const router = express.Router();
const { viewAdmin, addProduct, viewProduct, updateProduct, deleteProduct } = require('../controller/vendorController');


router.get('/dashboard', viewAdmin);
router.get('/product', viewProduct);
router.post('/addProduct', addProduct); 
router.post('/updateProduct/:id', updateProduct); 
router.post('/deleteProduct/:id', deleteProduct);

module.exports = router;