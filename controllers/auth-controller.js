

function getHome(req, res) {

}

function getSignUp(req, res) {
    res.render('customer/auth/signUp');
}

function getSignIn(req, res) {
    res.render('customer/auth/signIn');
}

module.exports = {
    getHome: getHome,
    getSignUp: getSignUp,
    getSignIn: getSignIn,
}