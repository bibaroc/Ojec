var crypto = require("crypto");
var User = require("../modules/user");
var Product = require("../modules/product");
var jwt = require("jsonwebtoken");
var conf = require("../modules/config")


module.exports = (function () {
    'use strict';
    var publicRouter = require("express").Router();

    var parser = require("body-parser");
    publicRouter.use(parser.urlencoded({ "extended": true }));
    publicRouter.use(parser.json());

    publicRouter.get('/', function (req, res) {
        res.redirect("/index.html");
    });

    publicRouter.post('/signup', function (req, res) {
        var user = new User(
            {
                "name": req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1).toLowerCase(),
                "lastName": req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1).toLowerCase(),
                "email": req.body.email.toLowerCase(),
                "hash": crypto.createHash("sha256").update(req.body.password).digest("hex"),
                "admin": false,
                "cart": [],
                "itemsWatching": [],
                "itemsSelling": []
            });
        user.save(function (err) {
            if (err) {
                if (err.code === 11000) {
                    res.status(406).send(
                        {
                            "success": false,
                            "msg": "There is already an account registered with this email."
                        });
                }
            }
            else {
                res.status(200).send(
                    {
                        "success": true,
                        "msg": "User " + user.name + " " + user.lastName + " added.",
                        "token": jwt.sign(
                            {
                                "name": user.name,
                                "lastName": user.lastName,
                                "admin": user.admin,
                                "email": user.email
                            },
                            conf.secret)
                    });
            }
        });
    });

    publicRouter.post("/signin", function (req, res) {
        User.findOne(
            {
                "email": req.body.email,
                "hash": crypto.createHash("sha256").update(req.body.password).digest("hex")
            },
            function (err, user) {
                if (err) {
                    res.status(500).send(
                        {
                            "success": false,
                            "msg": "Server internal error while looking up the db."
                        });
                }
                else if (!user) {
                    res.status(406).send(
                        {
                            "success": false,
                            "msg": "User not found/wrong password."
                        });
                }
                else {
                    var token = jwt.sign(
                        {
                            "name": user.name,
                            "lastName": user.lastName,
                            "admin": user.admin,
                            "email": user.email
                        },
                        conf.secret);
                    res.status(200).send(
                        {
                            "success": true,
                            "msg": user.hash,
                            "token": token
                        });
                }
            });

    });

    //TODO: Fix
    publicRouter.post("/getItems", function (req, res) {
        //If someone asks for a specific id i can try and search the db
        if (req.body.id) {
            //Regex pattern
            if (req.body.id.match(/^[0-9a-fA-F]{24}$/)) {
                Product.findOne({ "_id": req.body.id }, function (err, product) {
                    //Error looking up the db
                    if (err) {
                        console.log(err.code + " : " + err.message);
                        res.status(500).send({
                            "success": false,
                            "msg": "Something went very wrong."
                        });
                    }
                    //Nothing found
                    else if (!product) {
                        res.status(404).send({
                            "success": false,
                            "msg": "Can't find the product brah."
                        });
                    }
                    //Something found kek, could be only one item
                    else {
                        res.status(200).send({
                            "success": true,
                            "msg": "Ya item bra",
                            "data": product
                        });
                    }
                });
            } else {
                res.status(404).send({
                    "success": false,
                    "msg": "Can't find the product brah."
                });
            }
        } else {
            //Product.find({}, (error, product) => { });
            var items = [];
            //Last 10 products
            Product.find({}).sort('date').limit(10).exec(function (err, products) {
                products.forEach(function (prod) {
                    items.push(prod);
                });
                res.status(200).send({
                    "success": true,
                    "msg": "Ya itemz bra.",
                    "data": items
                });
            });
        }

    });
    return publicRouter;
})();
