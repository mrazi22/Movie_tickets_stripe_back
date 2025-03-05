const Product = require("../models/ProductModel");
const createError = require("http-errors");


module.exports = {
  addProducts: async (req, res, next) => {
    try {
      const productDetail = req.body;

      console.log("Product Detail >>>>", productDetail);

      // Create a new Product document
      const newProduct = new Product(productDetail);

      // Save the document to the database
      const savedProduct = await newProduct.save();

      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
      });
    } catch (error) {
      // Handle specific errors if needed
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }

      // Handle other errors
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getProducts: async (req, res, next) => {
    try {
      // Use async/await for concise error handling
      const products = await Product.find();

      // Handle success
      res.status(200).json({
        message: "Products fetched successfully",
        products: products,
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};