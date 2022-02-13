const path = require("path");

const express = require("express");
const csrf = require("csurf");
const session = require("express-session");
const app = express();

const db = require("./database/database");
const authRoute = require('./routes/auth-route');

const csrfMW = require('./middlewares/csrf-token-mw');
const authMW = require("./middlewares/auth-mw");
const errMW = require('./middlewares/error-handler');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

//const mongodbSessionStore = sessionConfig.sessionKey(session);

//refactored session
//app.use(session(sessionConfig.headerKey(mongodbSessionStore)));
app.use(csrf());

app.use(csrfMW);
app.use(authMW);

app.use(authRoute);

/* app.use(function (error, req, res, next) {
  res.render("500");
}); */
app.use(errMW);


db.connectToDatabase().then(function () {
  app.listen(3000);
}).catch(function (err) {
  console.log('failed to connect to database!');
  console.log(err);
});
