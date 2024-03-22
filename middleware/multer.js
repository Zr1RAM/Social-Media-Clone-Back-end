const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
})

const upload = multer({storage: storage});

const singleFileUpload = upload.single('file');

module.exports = { singleFileUpload };