const express = require('express');
const router = express.Router();

const authContr = require('../controllers/auth-controller');

//router.get('/', authContr.getHome);

router.get('/signUp', authContr.getSignUp);

router.post('/signUp', authContr.createAccount);

router.get('/signIn', authContr.getSignIn);

router.post('/logIn', authContr.logIn);

module.exports = router;