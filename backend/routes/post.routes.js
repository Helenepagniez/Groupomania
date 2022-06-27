const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer();

router.get('/', postController.readPost);//lire post
router.post('/', upload.single('file') , postController.createPost);//écrire post
router.put('/:id', postController.updatePost);//modifier post
router.delete('/:id', postController.deletePost);//supprimer post
router.patch('/like-post/:id', postController.likePost);//aimer post
router.patch('/unlike-post/:id', postController.unlikePost);//ne plus aimer post

//comments
router.patch('/comment-post/:id', postController.commentPost);//écrire commentaire post
router.patch('/edit-comment-post/:id', postController.editCommentPost);//modifier commentaire post
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);//supprimer commentaire post


module.exports = router;