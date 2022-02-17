const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");
const createSessionConfig = require('./config/session-config');

const db = require("./database/database");
const authRoute = require('./routes/auth-route');
const productsRoutes = require('./routes/products-routes');
const baseRoutes = require('./routes/base-routes');
const checkAuthStatus = require('./middlewares/check-auth');

const csrfMW = require('./middlewares/csrf-token-mw');
const errMW = require('./middlewares/error-handler');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

/* const mongodbSessionStore = createSessionConfig.sessionKey(expressSession);
app.use(expressSession(createSessionConfig.headerKey(mongodbSessionStore))); */
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csrf());

app.use(csrfMW);
app.use(checkAuthStatus);

app.use(baseRoutes);
app.use(authRoute);
app.use(productsRoutes);

app.use(errMW);

db.connectToDatabase().then(function () {
  app.listen(3000);
}).catch(function (err) {
  console.log('failed to connect to database!');
  console.log(err);
});
