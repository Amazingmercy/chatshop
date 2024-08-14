const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY


const viewLogin = async (req, res) => {
    res.render('login', { error: "", message: ""})
}

const viewHome = async (req, res) => {
    res.render('index', { error: "", message: ""})
}

const register = async(req, res) => {
    const {name, email, password, cPassword, whatsAppBussinessLink, businessName} = req.body

    
    const existingUser = await User.findOne({email})
    

    try{
        if(password != cPassword){
            return res.status(400).render('index', {error: 'Password do not match', message: ""})
        }
        if(existingUser){
            return res.status(400).render('index', {error: 'Email has been registered!', message: ""})
        }


        const newUser = await User.create({ name, email, password, whatsAppBussinessLink, businessName });
        res.render('login', { message: `User registered successfully!`, newUser, error: ''});
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
    res.redirect('/dashboard', 200, { message: `Logged in successfully!`});
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
    register,
    login,
    logout,
    viewHome,
    viewLogin
}