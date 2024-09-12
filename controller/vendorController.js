const User = require('../models/userModel')
const Product = require('../models/productModel');
const cloudinary = require('cloudinary').v2



const viewAdmin = async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    res.render('admin', {
        user,
        token: req.user.token, error: "", message: ""
    })
}

const viewProduct = async (req, res) => {

    const user = await User.findOne({ email: req.user.email });
    const products = await Product.find({ userId: user._id }).select('name price picture_url')



    res.render('product', {
        user,
        products,
        token: req.user.token,
        message: "",
        error: ""
    });
}


const addProduct = async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    try {
        const { pName, pPrice } = req.body;
        
        const result = await cloudinary.uploader.upload(
            req.files.pImage.tempFilePath,
            {
                use_filename: true, folder: 'chatshop'
            });
        const imageUrl = result.secure_url;
        console.log(imageUrl)


        await Product.create({
            userId: user._id,
            name: pName,
            price: parseFloat(pPrice),
            picture_url: imageUrl,  // Store Cloudinary URL
        });




        const products = await Product.find({ userId: user._id });
        res.render('admin', { message: 'Product added successfully!', user, products, error: "", token: req.user.token });
    } catch (error) {
        const user = await User.findOne({ email: req.user.email });
        const products = await Product.find({ userId: user._id });
        res.render('admin', { error: error.message, user, products, message: "", token: req.user.token });
    }
};


const updateProduct = async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    try {
        const { pName, pPrice } = req.body;
        const productId = req.params.id;
        const updateData = {
            name: pName,
            price: parseFloat(pPrice),
        };

        // Upload the new image to Cloudinary if provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                req.files.pImage.tempFilePath,
                {
                    use_filename: true, folder: 'chatshop'
                });
            updateData.picture_url = result.secure_url;
        }


        await Product.findOneAndUpdate(
            { _id: productId, userId: user._id },
            { $set: updateData }
        );

        const products = await Product.find({ userId: user._id });
        res.render('product', { message: "Product updated successfully", error: "", user, products });
    } catch (error) {
        res.render('product', { error: error.message, message: "" });
    }
};



const deleteProduct = async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    const productId = req.params.id

    try {
        await Product.findOneAndDelete({ _id: productId, userId: user._id });
        const products = await Product.find({ userId: user._id });
        res.render('product', { message: `Product has been deleted`, error: "", products, user });
    } catch (error) {
        res.render('index', { error: error.message, message: "" });
    }
};





module.exports = {
    addProduct,
    viewProduct,
    updateProduct,
    deleteProduct,
    viewAdmin
}