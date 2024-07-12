const express = require('express')
const router = express.Router()
const {addProduct, viewProduct, updateProduct, deleteProduct} = require('../controller/vendorController')
const upload = require('../middlewares/multer')


router.route('/vendor').get(viewProduct)
router.route('/addProduct', upload.single('p_image')).post(addProduct)
router.route('/updateProduct/:id', upload.single('p_image')).post(updateProduct)
router.route('/deleteProduct/:id').post(deleteProduct)










module.exports = router;