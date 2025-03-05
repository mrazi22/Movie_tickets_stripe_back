const express = require('express')
const productController = require('../controllers/productController')
const router = express.Router()


router.get('/products', productController.getProducts)
router.post('/addproducts', productController.addProducts)


module.exports = router
