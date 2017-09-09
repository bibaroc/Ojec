'use strict';

//IMPORTING MODULES
var app = require('express').express();
var morgan = require('morgan');
var mongoose = require("mongoose");
var conf = require("./modules/config");
var User = require('./modules/user')


/////////////////////////////////////////////////////
//SETTING UP DEPENDENCIES
/////////////////////////////////////////////////////
var port = 8080;
app.use(morgan('dev'));
mongoose.connect(conf.database, conf.databaseOptions);


/////////////////////////////////////////////////////
//BASIC ROUTES, NO NEED FOR AUTHENTICATION,
//ALLOWS FOR LOGIN TO HAPPEN, THEN PROCEED
/////////////////////////////////////////////////////
app.use("", require("./routes/public.routes"));

/////////////////////////////////////////////////////
//BASIC USER ROUTES, NEEDS LOGIN
//CONTAINS MIDDLEWARE CHECKING FOR JWT
/////////////////////////////////////////////////////
app.use("/user", require("./routes/authenticated_user.routes"));

/////////////////////////////////////////////////////
//COMMON AUTHENTIFICATION MIDDLEWARE
/////////////////////////////////////////////////////

//var authenticatedAdmin = express.Router();
//require("./middlewares/logged_in_admin")(authenticatedAdmin);
//require("./routes/logged_in_admin");

/////////////////////////////////////////////////////
//CHAINING ROUTERS TO THE APP
/////////////////////////////////////////////////////
//app.use("/user", authenticatedUser);
//app.use("/admin", authenticatedAdmin);

app.listen(port, () => {
    console.log('This simple server is listening on port:' + port + '!')
});