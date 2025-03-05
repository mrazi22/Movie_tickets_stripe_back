
const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    FullName: String,
    email:{
        type: String,
        unique: true,
        required: true
    },
    password: String,
    userType: String,
  },
 
);

const User = mongoose.model("User", UserDetailsScehma);

module.exports = User