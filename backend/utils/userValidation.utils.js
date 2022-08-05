const Joi = require('joi');

const userValidation = (body) => {
    const UserShema = Joi.object({
      name: Joi.string()
        .regex(/^[a-zA-ZÀ-ÿ -]{2,40}$/)
        .lowercase()
        .trim()
        .required(),

      firstname: Joi.string()
        .regex(/^[a-zA-ZÀ-ÿ -]{2,40}$/)
        .trim()
        .required(),

      email: Joi.string()
        .lowercase()
        .trim()
        .email({ minDomainSegments: 2 })
        .required(),

      password: Joi.string()
        .required()
        .regex(/^[a-zA-ZÀ-ÿ -]{6,40}$/),

      confirmPassword: Joi.string()
        .required()
        .regex(/^[a-zA-ZÀ-ÿ0-9 -]{6,40}$/),

      job: Joi.string().required(),

      picture: Joi.string().allow(null),

      role: Joi.string(),

      bio: Joi.string(),

      followers: Joi.string(),

      following: Joi.string(),

      likes: Joi.string(),
    });
    return UserShema.validate(body)
};

module.exports = userValidation