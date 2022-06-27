const UserModel =  require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

const maxAge =  3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

//inscription
module.exports.signUp = async (req, res) => {
    console.log(req.body);
    const {pseudo, email, password} = req.body

    try{
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({user: user._id});
    }
    catch(err) {
        const errors = signUpErrors(err);
        res.status(200).send({errors})
    }
};

//connexion
module.exports.signIn = async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt',{httpOnly: true, maxAge});
        res.status(200).json({user: user._id})
    } catch (err){
        const errors = signInErrors(err);
        res.status(200).json({errors});
    }
};

//déconnexion
module.exports.logout = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
};