const post = require('../models/Post'); // import du modèle post
const fs = require('fs'); // file system, package qui permet de modifier et/ou supprimer des fichiers


// création, modification, suppression et récupération post
exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.post);
    delete postObject._id;    
    const post = new Post({ // un nouvel objet post est crée avec le model post
        ...postObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   // l'url de l'image enregistrée dans le dossier images du serveur est aussi stockée dans la bdd      
    });
    post.save() // le post est sauvegardée dans la bdd
    .then( () => res.status(201).json({ message: 'Post sauvegardé'}))
    .catch( error => res.status(400).json({ error }))
    console.log(post);
};

exports.modifyPost = (req, res, next) => {
    const postObject = req.file ? // on vérifie si la modification concerne le body ou un nouveau fichier image
    {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id} , {...postObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Post modifié'}))
    .catch(()=> res.status(400).json({ error}))
};

exports.deletePost = (req, res, next) => {
    Post.findOne({_id: req.params.id}) // on identifie le post
    .then(post => {
    const filename = post.imageUrl.split('/images/')[1]; // on récupère l'adresse de l'image
    fs.unlink(`images/${filename}`, () => { /// on la supprime du serveur
    Post.deleteOne({_id: req.params.id}) // on supprime le post de la bdd
    .then(()=> res.status(200).json({ message: 'Post supprimé'}))
    .catch(error => res.status(400).json({ error}))
    });
})
};

exports.getAllPosts = (req, res, next) => { // on récupère tous les posts
    Post.find()
    .then( posts => res.status(200).json(posts))
    .catch( error => res.status(400).json({ error }))
};

exports.getOnePost = (req, res, next) => {  // on récupère un seul post
    Post.findOne({_id : req.params.id})
    .then( post => res.status(200).json(post))
    .catch( error => res.status(404).json({ error }))
};


//like et dislike
exports.likePost = (req, res, next) => {    
    const like = req.body.like;
    if(like === 1) { // bouton j'aime
        Post.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous aimez ce post' }))
        .catch( error => res.status(400).json({ error}))

    } else if(like === -1) { // bouton je n'aime pas
        Post.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous n’aimez pas ce post' }))
        .catch( error => res.status(400).json({ error}))

    } else {    // annulation du bouton j'aime ou alors je n'aime pas
        Post.findOne( {_id: req.params.id})
        .then( post => {
            if( post.usersLiked.indexOf(req.body.userId)!== -1){
                Post.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
                .then( () => res.status(200).json({ message: 'Vous n’aimez plus ce post' }))
                .catch( error => res.status(400).json({ error}))
                }
                
            else if( post.usersDisliked.indexOf(req.body.userId)!== -1) {
                Post.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
                .then( () => res.status(200).json({ message: 'Vous aimerez peut-être ce post à nouveau' }))
                .catch( error => res.status(400).json({ error}))
                }           
        })
        .catch( error => res.status(400).json({ error}))             
    }   
};