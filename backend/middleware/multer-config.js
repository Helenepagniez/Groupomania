const multer = require('multer');

const MIME_TYPES = { // dictionnaire d'extensions d'images
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => { // destination des images
        callback(null, 'images');
    },
    filename: (req, file, callback) => { // nouveau nom du fichier image pour éviter les doublons
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});
module.exports = multer({ storage: storage}).single('image'); 
