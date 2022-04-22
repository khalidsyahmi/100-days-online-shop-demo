const Order = require('../models/order-model');
const User = require('../models/user-model');

let mongodbUrl = 'mongodb://127.0.0.1:27017';

/* 'http://localhost:3000'
 */
if (process.env.MONGODB_URL) {
  mongodbUrl = process.env.MONGODB_URL;
}

const stripe = require('stripe')('sk_test_51K9UzpH3uarJZ1YZcMYjMFDMhq2MSvK6YSA3j6IlAMj7QrjqiZOD7NOypQPK8Cq8jkefT79bgr3W4N5wyPWl9lj400iajuKX9c');

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;


  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  //stripe checkout
  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map(function (item) {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title
          },
          unit_amount_decimal: +item.product.price.toFixed(2) * 100
        },
        quantity: 1
      }
    }),
    mode: 'payment',
    success_url: `${mongodbUrl}/orders/success`,
    cancel_url: `${mongodbUrl}/orders/failure`,
  });

  res.redirect(303, session.url);
}

function getSuccess(req, res) {
  res.render('customer/orders/success');
}

function getFailure(req, res) {
  res.render('customer/orders/failure');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure
};