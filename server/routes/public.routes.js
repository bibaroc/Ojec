var crypto = require("crypto");
var User = require("../modules/user");
var Product = require("../modules/product");
var jwt = require("jsonwebtoken");
var conf = require("../modules/config");


module.exports = (function () {
    'use strict';
    var publicRouter = require("express").Router();

    var parser = require("body-parser");
    publicRouter.use(parser.urlencoded({ "extended": true }));
    publicRouter.use(parser.json());

    publicRouter.get('/', function (req, res) {
        res.redirect("/index.html");
    });

    publicRouter.get("/getSellers", function (req, res) {
        User.find({ "admin": true })
            .sort("name")
            .exec(function (error, sellers) {
                if (error) {
                    console.log(error.message);
                    return res.status(500).send({
                        "success": false,
                        "msg": "I cant query a db"
                    });
                } else if (!sellers) {
                    return res.status(200).send({
                        "success": true,
                        "msg": "I cant query a db.",
                        "sellers": [{ "nm": "This could be your company name.", "desc": "And here there could be a description of your company. Come sell with us." }]
                    });
                } else {
                    var response = {
                        "success": true,
                        "msg": "Here you go ya boi.",
                        "sellers": []
                    };
                    sellers.forEach(function (seller) {
                        response.sellers.push({ "nm": seller.companyname, "desc": seller.description });
                    });
                    return res.status(200).send(response);
                }
            });
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
                "itemsSelling": [],
                "pastTransactions": [],
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet velit imperdiet eros semper porta. In pellentesque blandit sem vel sollicitudin. Quisque sed ligula sed nisl congue egestas in non elit. Vivamus at dictum nibh. Sed id eros eu urna rutrum pharetra pellentesque id dui. Integer convallis eros eu odio luctus, ut facilisis arcu pellentesque. Ut vehicula volutpat scelerisque. In dapibus nibh sed erat ultricies convallis. Proin mattis vehicula porta. Donec eget erat molestie, fringilla leo eget, maximus odio. Maecenas ut risus quis massa sodales porttitor sagittis in felis. Donec in nisl quis justo egestas pellentesque eget eget libero. Sed in sagittis felis. Nulla facilisi.",
                "companyname": "Sulimovskyy Srl"
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
                        console.log("requested " + req.body.id);
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
}());
