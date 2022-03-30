const express = require('express');

const cartController = require('../controllers/cart-controller');

const router = express.Router();

router.get('/', cartController.getCart); // /cart omitted

router.post('/items', cartController.addCartItem); // /cart/items

router.patch('/items', cartController.updatedCartItem);

module.exports = router;