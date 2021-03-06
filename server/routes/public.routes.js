var crypto = require("crypto");
var User = require("../modules/user");
var Product = require("../modules/product");
var jwt = require("jsonwebtoken");
var conf = require("../modules/config");
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'myfreakinmailer@gmail.com',
        pass: require("../modules/config").trasportedPW
    }
});

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

    publicRouter.get("/forget/:email", function (req, res) {
        User.findOne({ "email": req.params.email })
            .exec(function (error, user) {
                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        "success": false,
                        "msg": "Internal server error while looking up the user."
                    });
                } else if (!user) {
                    return res.status(400).send({
                        "success": false,
                        "msg": "Are you tinkering with the server?"
                    });
                } else {
                    return res.status(200).send({
                        "success": true,
                        "msg": "Here is your security Question.",
                        "data": user.securityQuestion
                    });
                }
            });
    });

    publicRouter.post("/forget/:email", function (req, res) {
        User.findOne({ "email": req.params.email })
            .exec(function (error, user) {
                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        "success": false,
                        "msg": "Internal server error while looking up the user."
                    });
                } else if (!user) {
                    return res.status(400).send({
                        "success": false,
                        "msg": "Are you tinkering with the server?"
                    });
                } else {
                    if (user.securityAnswer === crypto.createHash("sha256").update(req.body.securityAnswer).digest("hex")) {

                        var newPW = crypto.randomBytes(16).toString('hex');
                        user.hash = crypto.createHash("sha256").update(newPW).digest("hex");
                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                                return res.status(500).send({
                                    "success": false,
                                    "msg": "ItHERE WAS AN ERROR WHILE TRYING TO SAVE THE CHANGES."
                                });
                            } else {
                                if (require("../modules/config").env === "dev") {
                                    console.log(newPW);
                                } else {
                                    transporter.sendMail({
                                        from: 'myfreakinmailer@gmail.com',
                                        to: user.email,
                                        subject: 'Information',
                                        text: 'Dear Customer, we are glad to inform you that you have successfuly changed you password as follows: ' + newPW + ' .'
                                    }, function (error, info) {
                                        if (error) {
                                            console.log(error);
                                        }
                                    });
                                }
                                return res.status(200).send({
                                    "success": true,
                                    "msg": "A random password has been generated and sent to your email account."
                                });
                            }
                        });
                    } else {
                        return res.status(400).send({
                            "success": false,
                            "msg": "Nope."
                        });
                    }
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
                "securityQuestion": req.body.securityQuestion,
                "securityAnswer": crypto.createHash("sha256").update(req.body.securityAnswer).digest("hex"),
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
        }
        else {
            var fuckingItems = [];
            var name = req.body.name ? req.body.name : ""; //Item to look up in the db
            name = name.replace(/[^\w\s]/gi, ""); //Fuck you

            // var querr = Product.find(   //And also fuck you mongoose, if i specify a different query u dont need to execute the first one.
            //     { $or: [{ "name": { $regex: new RegExp(name, "i") } }, { "description": { $regex: new RegExp(name, "i") } }] } //\bTest\b
            // )
            //     .where("deleted", false); //Deleted items do not count

            var objectsFound = 0; //There are x items that match the query

            Product.find(
                { $or: [{ "name": { $regex: new RegExp(name, "i") } }, { "description": { $regex: new RegExp(name, "i") } }] } //\bTest\b
            )
                .where("deleted", false)
                .count((
                    er, c) => {
                    if (er) {
                        console.log(er);
                        return res.status(500).send({
                            "success": false,
                            "msg": "Internal error while looking up the database."
                        });
                    } else if (c === 0) {
                        res.status(200).send({
                            "success": true,
                            "msg": "There are no items matching with the searh criteria.",
                            "data": fuckingItems,
                            "metadata": {
                                "totalResults": objectsFound,
                                "pageN": 1
                            }
                        })
                    } else {
                        var sor = "-insertionDate"; //Sort items by this
                        if (req.body.order) {
                            switch (req.body.order) {
                                case "-d":
                                    sor = "-insertionDate";
                                    break;
                                case "d":
                                    sor = "indertionDate";
                                    break;
                                case "a":
                                    sor = "name";
                                    break;
                                case "-a":
                                    sor = "-name";
                                    break;
                                default:
                                    sor = "-insertionDate";
                            }
                        }
                        var itemsPerPage = 10;
                        if (req.body.itemPP) {
                            switch (req.body.itemPP) {
                                case 10:
                                    itemsPerPage = 10;
                                    break;
                                case 20:
                                    itemsPerPage = 20;
                                    break;
                                case 30:
                                    itemsPerPage = 30;
                                    break;
                                default:
                                    itemsPerPage = 10;
                            }
                        }
                        objectsFound = c;
                        //Total number of items must be gr8er than the items on previous pages
                        var pageServed = req.body.page ? (objectsFound - ((req.body.page - 1) * itemsPerPage) > 1 && req.body.page > 0 ? req.body.page : 1) : 1;
                        Product.find(
                            { $or: [{ "name": { $regex: new RegExp(name, "i") } }, { "description": { $regex: new RegExp(name, "i") } }] } //\bTest\b
                        )
                            .where("deleted", false)
                            .sort(sor)//Descending
                            .skip((pageServed-1) * itemsPerPage)
                            .limit(itemsPerPage)
                            .exec(
                            function (error2, results) {
                                if (error2) {
                                    console.log(error2);
                                    return res.status(500).send({
                                        "success": false,
                                        "msg": "Sorry not sorry."
                                    });
                                } else if (!results) {
                                    return res.status(400).send({
                                        "success": true,
                                        "msg": "You should never see this."
                                    });
                                } else {
                                    //Got the items yay
                                    // console.log("result" + results);
                                    results.forEach(function (prod) {
                                        fuckingItems.push(prod);
                                    });
                                    res.status(200).send({
                                        "success": true,
                                        "msg": "Ya itemz bra.",
                                        "data": fuckingItems,
                                        "metadata": {
                                            "totalResults": objectsFound,
                                            "pageN": pageServed
                                        }
                                    });
                                }

                            });
                    }
                });

        }
    });

    return publicRouter;
}());
