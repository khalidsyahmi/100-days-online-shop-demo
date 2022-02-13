const UserModel = require('../models/user-model');

function getHome(req, res) {

}

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

module.exports = {
    getHome: getHome,
    getSignUp: getSignUp,
    createAccount: createAccount,
    getSignIn: getSignIn,
}