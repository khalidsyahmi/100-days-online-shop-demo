const path = require("path");

const express = require("express");
/* const session = require("express-session");
const csrf = require("csurf"); */
const app = express();

const db = require("./database/database");
const authRoute = require('./routes/auth-route');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); */

//const mongodbSessionStore = sessionConfig.sessionKey(session);

//refactored session
//app.use(session(sessionConfig.headerKey(mongodbSessionStore)));
//csrf function after session creation
//app.use(csrf());

//mw
/* app.use(authMW);
app.use(csrfMW); */

app.use(authRoute);

/* app.use(function (error, req, res, next) {
  res.render("500");
}); */

db.connectToDatabase().then(function () {
  app.listen(3000);
});
