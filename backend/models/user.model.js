const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator'); // package vérification d'un email unique


const userSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            trim: true
        },
        firstname : {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55
        },
        email : {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,  // unique -> une adresse mail = un user
            trim: true,
        },
        password : {
            type : String,
            required: true,
            max: 1024,
            minlength: 6
        },
        job : {
            type: String,
            required: true
        },
        role : {
            type: String,
            required: true
        },
        picture : {
            type : String
        },
        bio : {
            type: String,
            max: 1024,
        },
        followers : {
            type: [String]
        },
        following : {
            type: [String]
        },
        likes : {
            type: [String]
        }
    },
    {
        timestamps: true,
    }
)

//play function before save into display: 'block'
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email')
};

userSchema.plugin(uniqueValidator); // utilisation du package
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;