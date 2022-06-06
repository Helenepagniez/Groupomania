const mongoose = require('mongoose');

const postSchema = mongoose.Schema({ // schema du modèle de post 
    
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0 },
    userId: { type: String },
    usersLiked: [String],
    usersDisliked: [String] ,
});
module.exports = mongoose.model('Post', postSchema);