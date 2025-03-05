const joi = require("joi");


const loginSchema = joi.object({
    
    email: joi.string().email().required(),
    password: joi.string().required().min(8),
   
    


});

module.exports = {loginSchema}