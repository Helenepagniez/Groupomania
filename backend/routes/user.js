const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // package de prévention des forces brutes
const userCtrl = require('../controllers/user');

const passLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // Temps défini (en minutes) pour tester l'application
    max: 3 // essais max par adresse ip
  });

//routes POST pour créer un compte ou se connecter envoyé par le frontend
router.post('/signup', userCtrl.signup);
router.post('/login',passLimiter, userCtrl.login);

//export du router
module.exports = router;