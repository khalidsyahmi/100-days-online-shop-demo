const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");
const createSessionConfig = require('./config/session-config');

const db = require("./database/database");
const authRoute = require('./routes/auth-route');
const productsRoutes = require('./routes/products-routes');
const baseRoutes = require('./routes/base-routes');
const adminRoutes = require('./routes/admin-routes');
const cartRoutes = require('./routes/cart-route');
const ordersRoutes = require('./routes/orders-routes');

const adminRouteGuardMW = require('./middlewares/route-guard');
const checkAuthStatusMW = require('./middlewares/check-auth');
const csrfMW = require('./middlewares/csrf-token-mw');
const errMW = require('./middlewares/error-handler');
const cartMW = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');

let port = 3000;

if (process.env.PORT) {
  port = process.env.PORT
}

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use('/products/assets/', express.static('images'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


/* const mongodbSessionStore = createSessionConfig.sessionKey(expressSession);
app.use(expressSession(createSessionConfig.headerKey(mongodbSessionStore))); */
const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMW);
app.use(updateCartPricesMiddleware);

app.use(csrfMW);
app.use(checkAuthStatusMW);

app.use(baseRoutes);
app.use(authRoute);
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', adminRouteGuardMW, ordersRoutes);
app.use('/admin', adminRouteGuardMW, adminRoutes);


app.use(notFoundMiddleware);

app.use(errMW);

db.connectToDatabase()
  .then(function () {
    app.listen(port);
  })
  .catch(function (err) {
    console.log('failed to connect to database!');
    console.log(err);
  });
