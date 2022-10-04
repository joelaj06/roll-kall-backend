const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req, file , cb) => {
        cb(null, 'uploads')
    },
    filename : (req, file , cb) => {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const filename = `${file.originalname}-${Date.now()}.${extension}`
         cb(null, filename);
    }, 
});

const upload = multer({storage: storage});

module.exports = upload;

