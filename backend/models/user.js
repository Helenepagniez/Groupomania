const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // package vérification d'un email unique

const userSchema = mongoose.Schema({ // schema du modèle user demandé
    email: { type: String, required: true, unique: true }, // unique -> une adresse mail = un user
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // utilisation du package
module.exports = mongoose.model('User', userSchema);