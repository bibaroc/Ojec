﻿'use strict';

//IMPORTING MODULES
var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require("mongoose");
var conf = require("./modules/config");

/////////////////////////////////////////////////////
//SETTING UP DEPENDENCIES
/////////////////////////////////////////////////////
var port = 8080;
app.use(morgan('dev'));
mongoose.connect(conf.database, conf.databaseOptions);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

/////////////////////////////////////////////////////
//BASIC ROUTES, NO NEED FOR AUTHENTICATION,
//ALLOWS FOR LOGIN TO HAPPEN, THEN PROCEED
/////////////////////////////////////////////////////
app.use(require('express-bearer-token')());
app.use(express.static('../client'));
app.use("", require("./routes/public.routes"));

/////////////////////////////////////////////////////
//BASIC USER ROUTES, NEEDS LOGIN
//CONTAINS MIDDLEWARE CHECKING FOR JWT
/////////////////////////////////////////////////////
app.use(require("./middlewares/authenticated-user.middleware"));
app.use("/user", require("./routes/authenticated-user.routes"));

/////////////////////////////////////////////////////
//ADMIN USER ROUTES, NEEDS LOGIN
//CONTAINS MIDDLEWARE CHECKING FOR ADMIN PROPERTIES
/////////////////////////////////////////////////////
app.use(require("./middlewares/authenticated-admin.middleware"));
app.use("/admin", require("./routes/authenticated-admin.routes"));

app.listen(port, () => {
    console.log('This simple server is listening on port:' + port + '!');
});
