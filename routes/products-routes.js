const express = require('express');
const router = express.Router();

const authContr = require('../controllers/auth-controller');

router.get('/products', function (req, res) {
    res.render('customer/products/all-products');
});

module.exports = router;