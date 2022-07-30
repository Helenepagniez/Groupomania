const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require('../middleware/multer-config');
const {requireAuth} = require('../middleware/auth.middleware');

router.get('/', requireAuth, postController.readPost);//lire post
router.post('/', requireAuth, multer, postController.createPost);//écrire post
router.put('/:id', requireAuth,multer, postController.updatePost);//modifier post
router.delete('/:id', requireAuth, postController.deletePost);//supprimer post
router.patch('/like-post/:id', requireAuth, postController.likePost);//aimer post
router.patch('/unlike-post/:id', requireAuth, postController.unlikePost);//ne plus aimer post

//comments
router.patch('/comment-post/:id', requireAuth, postController.commentPost);//écrire commentaire post
router.patch('/edit-comment-post/:id', requireAuth, postController.editCommentPost);//modifier commentaire post
router.patch('/delete-comment-post/:id', requireAuth, postController.deleteCommentPost);//supprimer commentaire post


module.exports = router;