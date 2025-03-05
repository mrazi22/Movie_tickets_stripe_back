const createError = require("http-errors")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {loginSchema} = require("../helpers/LoginSchema")
const {authSchema} = require("../helpers/ValidationSchema")

const secretkey = "kudonjo"

module.exports = {
    register:async (req, res, next) => {
        try {
            const {fullName, email, password, userType} = req.body

            //validation
            await authSchema.validateAsync(req.body)

            //check if user exists
            const existingUser = await User.findOne({email: email})

            if(existingUser){
                throw createError.Conflict(`${email} already exists`)
            }
            //hash password 
            const hashedPassword = await bcrypt.hash(password, 10)


            //create new user with hashed password
            const newUser = new User({
                fullName,
                email,
                password: hashedPassword,
                userType
            })
            await newUser.save();

            //generate token
            const token = jwt.sign({id: newUser._id}, secretkey, {expiresIn: "1h"})

            //success
            res.status(201).json({message:"user create succesfully", token,userType})
            
        } catch (error) {
            next(error)
        }
    },
    login:async (req, res, next) => {
        try {
            const {email,password}= req.body

            //validation
            await loginSchema.validateAsync(req.body)

            //find user by email
            const user = await User.findOne({email: email})
            if(!user){
                return res.status(401).json({message:"invalid email or password"})

            }

            //compare password
            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch){
                return res.status(401).json({message:"invalid email or password"})
            }

            //generate token
            const token = jwt.sign({id: user._id}, secretkey, {expiresIn: "1h"})

            //success
            res.status(201).json({message:"user login succesfully", token, userType: user.userType})
            
        } catch (error) {
            next(error)
            
        }

    },
    
}