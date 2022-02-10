const express = require('express');
const router = express.Router();

const authContr = require('../controllers/auth-controller');

router.get('/', authContr.getHome);

router.get('/signUp', authContr.getSignUp);

router.get('/signIn', authContr.getSignIn);

module.exports = router;