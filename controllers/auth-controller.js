const UserModel = require('../models/user-model');
const authUtil = require('../util/authentication-util');

/* function getHome(req, res) {

} */

function getSignUp(req, res) {
    res.render('customer/auth/signUp');
}

async function createAccount(req, res) {
    const userData = req.body;
    const enteredEmail = userData.email; // userData['email']
    //  const enteredConfirmEmail = userData["email-confirm"];
    const enteredPassword = userData.password;
    //  const enteredConfirmPassword = userData["password-confirm"];

    const user = new UserModel(
        enteredEmail,
        enteredPassword,
        req.body['full-name'],
        req.body.street,
        req.body['postal-code'],
        req.body.city);

    await user.signup();

    res.redirect('/signIn');
}

function getSignIn(req, res) {
    res.render('customer/auth/signIn');
}

async function logIn(req, res) {
    const user = new UserModel(req.body.email, req.body.password);
    const existingUser = await user.getyUserSameEmail();

    if (!existingUser) {
        return res.redirect('/signIn');
    }

    const passwordIsCorrect = await user.hasMatchingPassword(
        existingUser.password
    );

    if (!passwordIsCorrect) {
        res.redirect('/signIn');
        return;
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/');
    });
}

module.exports = {
    //getHome: getHome,
    getSignUp: getSignUp,
    createAccount: createAccount,
    getSignIn: getSignIn,
    logIn: logIn
}