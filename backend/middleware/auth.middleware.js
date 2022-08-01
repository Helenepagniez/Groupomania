const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

//vérification de l'utilisateur et du token pour accès
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                res.locals.user =  null;
                res.cookie('jwt', '', {maxAge: 1});
                return res.status(401).send(err);
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
};

//authentification de connexion
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err);
            } else  {
                console.log(decodedToken.id);
                next();
            }
        })
    } else {
        return res.status(401).send(Error);
    }
};