const UserModel = require('../models/user-model');
const authUtil = require('../util/authentication-util');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

/* function getHome(req, res) {

} */

function getSignUp(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city: ''
        }
    }
    res.render('customer/auth/signUp', { inputData: sessionData });
}

async function createAccount(req, res, next) {
    const userData = req.body;
    const enteredEmail = userData.email; // userData['email']
    //  const enteredConfirmEmail = userData["email-confirm"];
    const enteredPassword = userData.password;
    //  const enteredConfirmPassword = userData["password-confirm"];

    //key value pairs can be spread in req data
    const enteredData = {
        email: enteredEmail,
        confirmEmail: userData["email-confirm"],
        password: enteredPassword,
        // enteredPassword: userData["password-confirm"],
        fullname: req.body['full-name'],
        street: req.body.street,
        postal: req.body['postal-code'],
        city: req.body.city
    }

    if (
        !validation.userDetailsAreValid(
            enteredEmail,
            enteredPassword,
            req.body['full-name'],
            req.body.street,
            req.body['postal-code'],
            req.body.city
        ) || !validation.emailIsConfirmed(req.body.email, userData["email-confirm"])
        || !validation.passwordIsConfirmed(req.body.password, userData["password-confirm"])
    ) {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage: "creating account failed! check data, same email or password",
                ...enteredData
            },
            function () {
                res.redirect('/signup')
            }
        )
        return;
    }

    const user = new UserModel(
        enteredEmail,
        enteredPassword,
        req.body['full-name'],
        req.body.street,
        req.body['postal-code'],
        req.body.city);


    try {
        const existsAlready = await user.existsAlready();

        if (existsAlready) {
            sessionFlash.flashDataToSession(
                req,
                {
                    errorMessage: "creating account failed! email already exists in database",
                    ...enteredData
                },
                function () {
                    res.redirect('/signup')
                }
            )
            return;
        }

        await user.signup();

    } catch (err) {
        return next(err);
    }

    res.redirect('/signIn');
}

function getSignIn(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            password: ''
        }
    }
    res.render('customer/auth/signIn', { inputData: sessionData });
}

async function logIn(req, res) {
    const user = new UserModel(req.body.email, req.body.password);
    let existingUser;

    try {
        existingUser = await user.getUserSameEmail();
    } catch (err) {
        return next(err);
    }

    if (!existingUser) {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage: "Log in failed! no account with that email is found",
                email: req.body.email,
                password: req.body.password
            },
            function () {
                res.redirect('/signIn')
            }
        )
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(
        existingUser.password
    );

    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage: "Log in failed! incorrect password",
                email: req.body.email,
                password: req.body.password
            },
            function () {
                res.redirect('/signIn')
            }
        )
        return;
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/');
    });
}

function logOut(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/signIn');
}

module.exports = {
    //getHome: getHome,
    getSignUp: getSignUp,
    createAccount: createAccount,
    getSignIn: getSignIn,
    logIn: logIn,
    logOut: logOut
}