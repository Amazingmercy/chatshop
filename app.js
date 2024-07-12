require('dotenv').config();
const express = require('express')
const connectDB = require('./DB/config')
const DB_URI = process.env.MONGO_URI
const WhatsappMessages = require('./routes/whatsappRoutes')
const VendorRoutes = require('./routes/vendorRoutes')
const AuthRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const authenticate = require('./middlewares/authenticate')
const errorHandler = require('./middlewares/errorHandler')

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());


app.set('view engine', 'ejs')
app.set('views', './views');
app.use(express.static('static'));




app.use('/whatsapp', WhatsappMessages)
app.use(AuthRoutes)
app.use(authenticate, VendorRoutes)

app.use(errorHandler)









const port = process.env.PORT || 4501;
const start = async () => {
    try{
        await connectDB(DB_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`));
    } catch (error){
        console.log(error);
    }
    
}

start()