var crypto = require("crypto");
var User = require("../modules/user");
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
                "name": req.body.name,
                "lastName": req.body.lastName,
                "email": req.body.email,
                "hash": crypto.createHash("sha256").update(req.body.password).digest("hex"),
                "admin": false
            });
        user.save(function (err) {
            if (err) {
                if (err.code === 11000) {
                    res.json(
                        {
                            "success": false,
                            "msg": "Duplciate key, there can only be one account per email."
                        });
                }
            }
            else {
                res.json(
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
                    res.json(
                        {
                            "success": false,
                            "msg": "There was an error while looking up the user."
                        });
                }
                else if (!user) {
                    res.json(
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
                    res.json(
                        {
                            "success": true,
                            "msg": user.hash,
                            "token": token
                        });
                }
            });

    });
    return publicRouter;
})();
