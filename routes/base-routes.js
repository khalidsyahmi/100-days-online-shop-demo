const express = require('express');
const router = express.Router();

const authContr = require('../controllers/auth-controller');

router.get('/', function (req, res) {
    res.redirect('/products');
});

module.exports = router;