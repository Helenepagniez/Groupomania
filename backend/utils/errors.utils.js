//erreurs d'inscriptions
module.exports.signUpErrors = (err) => {
    let errors = {pseudo: '', email: '', password: ''}

    if(err.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect ou déjà pris";

    if(err.message.includes('email'))
        errors.email = "Email incorrect";
    
    if(err.message.includes('password'))
        errors.password = "Le mot de passe doit contenir 6 caractères minimum";

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
        errors.pseudo = 'Ce pseudo est déjà pris';

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = 'Cet email est déjà enregistré';

    return errors;
};

//erreurs de connexions
module.exports.signInErrors = (err) => {
    let errors = {email: '', password : ''}

    if(err.message.includes("email"))
        errors.email = "Email inconnu";

    if(err.message.includes("password"))
        errors.password = "Le mot de passe ne correspond pas";

    return errors;
};
