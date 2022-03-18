const express = require('express');
const router = express.Router();

const productContr = require('../controllers/products-controller');

/* router.get('/products', function (req, res) {
    res.render('customer/products/all-products');
}); */

router.get('/products', productContr.getAllProducts);

router.get('/products/:id',productContr.getProductDetails);

module.exports = router;