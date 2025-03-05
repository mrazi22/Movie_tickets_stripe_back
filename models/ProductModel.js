const mongoose = require("mongoose")

const  Schema = mongoose.Schema

const productSchema = new Schema({
    title: String,
    imageURL: String,
    price: Number,
    date: Date
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product