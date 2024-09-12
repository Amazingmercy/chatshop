
const multer = require('multer');



// Set up multer to use Cloudinary for image uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chatshop', 
    allowed_formats: ['jpg', 'png'],
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
