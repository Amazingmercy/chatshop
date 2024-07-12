const User = require('../models/userModel')
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET_KEY
const tokenStore = new Map();
const tokenBlackList = new Set();
const usedTokens = {};


const viewLogin = async (req, res) => {
    res.render('login', { error: "", message: ""})
}

const viewHome = async (req, res) => {
    res.render('index', { error: "", message: ""})
}

const viewProduct = async (req, res) => {

    const user = await User.findOne({ email: req.user.email });
    const products = await Product.find({ userId: user._id }).select('name price')
    

    
    res.render('admin', {
        user,
        products,
        token: req.user.token,
        message: "",
        error: ""
    });
}


const addProduct = async (req, res) => {
    const user = await User.findOne({email: req.user.email})
    try {
        const { pName, pPrice } = req.body;
        const pImage = req.file ? req.file.filename : null;
        const price = parseFloat(pPrice)

        await Product.create({
            userId: req.user._id,
            name: pName,
            price: price,
            image: pImage
        });

        console.log(price)


        const products = await Product.find({ userId: user._id });
        res.render('admin', { message: 'Product added successfully!', user, products, error: "", token: req.user.token });
    } catch (error) {
        const user = await User.findOne({ email: req.user.email });
        const products = await Product.find({ userId: user._id });
        res.render('admin', { error: error.message, user, products, message: "", token: req.user.token });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { pName, pPrice } = req.body;
        const { id } = req.params;
        const updateData = {
            name: pName,
            price: parseFloat(pPrice),
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        await Product.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { $set: updateData }
        );

        res.render('product', { message: "Product updated successfully"});
    } catch (error) {
        res.render('product', { message: error.message });
    }
};



const deleteProduct = async (req, res) => {
    try {
        await Product.findOneAndDelete({ _id: (req.params.id), userId: req.user._id });
        res.render('admin', { message: `Product has been deleted`});
    } catch (error) {
        res.render('index', { message: error.message });
    }
};


const register = async(req, res) => {
    const {name, email, password, cPassword, WhatsAppBussinessLink, businessName} = req.body
    
    const existingUser = await User.findOne({email})
    

    try{
        if(password != cPassword){
            return res.status(400).render('index', {error: 'Password do not match', message: ""})
        }
        if(existingUser){
            return res.status(400).render('index', {error: 'Email has been registered!', message: ""})
        }

        const newUser = await User.create({ name, email, password, WhatsAppBussinessLink, businessName });
        res.render('login', { message: `User registered successfully!`, newUser, error});
    }catch(error) {
        res.render('index', { message: "", error: error.message });
    }

}


const login = async(req, res) => {
    try{
    const {email, password} = req.body
    if(!email || !password){
        return res.render('login', { error: 'Enter Email and password', message: "" });
    }

    const user = await User.findOne({email})

    if(!user){
        return res.render('login', { error: 'Invalid Email', message: "" });
    }

    const validPassword = (password === user.password)
    if(!validPassword){
        return res.render('login', { error: 'Invalid Password', message: "" });
    }
    const payload = {
        userId: user._id,
        userEmail: user.email,
      };
    
      
      const token =  jwt.sign(payload, secretKey, { expiresIn: '100m' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
    res.redirect('/vendor', 200, { message: `Logged in successfully!` });
} catch (error){
    res.render('login', { error: error.message , message: ""});
}
}


const logout = async(req, res) => {
    const token = req.cookies.token;
    

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    res.clearCookie('token'); // 'token' is the name of the cookie
    return res.redirect('/login');
}




module.exports = {
    addProduct,
    viewProduct,
    updateProduct,
    deleteProduct,
    register,
    login,
    logout,
    viewHome,
    viewLogin
}