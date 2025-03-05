const joi = require("joi");

const authSchema = joi.object({
    fullName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(8),
    userType: joi.string().required(),

});

module.exports = {authSchema}