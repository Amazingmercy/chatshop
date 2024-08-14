const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer') 
const { viewAdmin, addProduct, viewProduct, updateProduct, deleteProduct } = require('../controller/vendorController');


router.get('/dashboard', viewAdmin);
router.get('/product', viewProduct);
router.post('/addProduct', upload.single('pImage'), addProduct);
router.post('/updateProduct/:id', upload.single('pImage'), updateProduct);
router.post('/deleteProduct/:id', deleteProduct);

module.exports = router;