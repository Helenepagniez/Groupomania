const router= require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const upload = multer();

//auth
router.post("/register", authController.signUp);//s'inscrire
router.post('/login', authController.signIn);//se connecter
router.get('/logout', authController.logout);//se déconnecter

//user display: 'block'
router.get('/', userController.getAllUsers);//voir liste des utilisateurs
router.get('/:id', userController.userInfo);// voir infos d'un utilisateur(profil)
router.put('/:id', userController.updateUser);//modifier un utilisateur
router.delete('/:id', userController.deleteUser);//supprimer un utilisateur
router.patch('/follow/:id', userController.follow);//suivre un utilisateur
router.patch('/unfollow/:id', userController.unfollow);//ne plus suivre un utilisateur

//upload
router.post('/upload', upload.single('file') ,uploadController.uploadProfil);//télécharger images


module.exports = router;