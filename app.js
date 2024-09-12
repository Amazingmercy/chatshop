require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const express = require('express')
const connectDB = require('./DB/config')
const DB_URI = process.env.MONGO_URI
const WhatsappMessages = require('./routes/whatsappRoutes')
const VendorRoutes = require('./routes/vendorRoutes')
const AuthRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const authenticate = require('./middlewares/authenticate')
const errorHandler = require('./middlewares/errorHandler')
const fileUpload = require('express-fileupload')


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.set('view engine', 'ejs')
app.set('views', './views');
app.use(express.static('static'));
app.use(fileUpload({ useTempFiles: true}))






app.use('/whatsapp', WhatsappMessages)
app.use(AuthRoutes)
app.use(authenticate, VendorRoutes)
app.use(errorHandler)



const port = process.env.PORT || 4501;
const start = async () => {
    try {
        await connectDB(DB_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }

}

start()