'use strict';
var crypto = require("crypto");

module.exports = function (basicRouter) {
    basicRouter.get('/', function (req, res) {
        res.send('Hello World!');
    });

    basicRouter.get('/signup', function (req, res) {
        //TODO: get actual data
        var user = new User(
            {
                "name": 'Vladyslav',
                "lastName": 'Sulimovskyy',
                "email": 'sulimovskyy.vladyslav@gmail.com',
                "hash": 'shit',
                "admin": true
            });
        //Saved in the users collection.
        if (user.hash) {
            //TODO: get salt.
            user.hash = crypto.createHash("sha256").update("passwordInserita").digest("hex");
        };
        user.save(function (err) {
            if (err) {
                if (err.code === 11000) {
                    res.send(
                        {
                            "success": false,
                            "msg": "Duplciate key, there can only be one account per email."
                        });
                }
            }
            else {
                res.send(
                    {
                        "success": true,
                        "msg": "User " + user.name + " " + user.lastName + " added."
                    });
            }
        });
    });

    basicRouter.post("/login", function (req, res) {
        User.findOne(
            {
                "email": req.body.email
            },
            function (err, user) {
                if (err) {
                    res.send(
                        {
                            "success": false,
                            "msg": "There was an error while looking up the user."
                        });
                }
                else if (!user) {
                    res.send(
                        {
                            "success": false,
                            "msg": "User not found."
                        });
                }
                else if (user) {
                    if (user.hash != crypto.createHash("sha256").update(req.body.password).digest("hex")) {
                        res.send(
                            {
                                "success": false,
                                "msg": "Wrong password."
                            });
                    } else {
                        var token = jwt.sign(
                            {
                                "name": user.name,
                                "lastName": user.lastName,
                                "admin": user.admin
                            },
                            basicRouter.get("superSecret"));
                        res.send(
                            {
                                "success": true,
                                "msg": "You logged in! Here is your token.",
                                "token": token
                            });
                    }
                }
            });

    });
};