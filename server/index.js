'use strict';

//IMPORTING MODULES
var express = require('express');
var app = express();
var morgan = require('morgan');
//Guess wat????? Used to parse body of post requests.
var bodyParser = require("body-parser");
//Used to connect to mongodb.
var mongoose = require("mongoose");
//Creates and validates web tokens.
var jwt = require("jsonwebtoken");
var conf = require("./modules/config");
var User = require('./modules/user')


/////////////////////////////////////////////////////
//SETTING UP DEPENDENCIES
/////////////////////////////////////////////////////
var port = 8080;
app.set('superSecret', conf.secret);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(conf.database, conf.databaseOptions);


/////////////////////////////////////////////////////
//BASIC ROUTES, NO NEED FOR AUTHENTICATION
/////////////////////////////////////////////////////
require("./routes/public")(app);

/////////////////////////////////////////////////////
//COMMON AUTHENTIFICATION MIDDLEWARE
/////////////////////////////////////////////////////
var authenticatedUser = express.Router();
require("./middlewares/logged_in_user")(authenticatedUser);
require("./routes/logged_in_user");

/////////////////////////////////////////////////////
//COMMON AUTHENTIFICATION MIDDLEWARE
/////////////////////////////////////////////////////

var authenticatedAdmin = express.Router();
require("./middlewares/logged_in_admin")(authenticatedAdmin);
require("./routes/logged_in_admin");

/////////////////////////////////////////////////////
//CHAINING ROUTERS TO THE APP
/////////////////////////////////////////////////////
app.use("/user", authenticatedUser);
app.use("/admin", authenticatedAdmin);

app.listen(port, function () {
    console.log('This simple server is listening on port:' + port + '!')
});