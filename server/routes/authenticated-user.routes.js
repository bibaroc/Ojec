var User = require("../modules/user");
var Product = require("../modules/product");
var mongoose = require('mongoose');

module.exports = (function () {
    'use strict';
    var userRouter = require("express").Router();
    userRouter.get("/", (req, res) => {
        res.send(
            {
                'success': true,
                'msg': 'You logged in as a user.'
            });
    });
    userRouter.get("/userInfo", (req, res) => {
        User.findOne(
            {
                "email": req.decoded.email
            },
            function (err, user) {
                if (err) {
                    res.status(500).send(
                        {
                            "success": false,
                            "msg": "There was an error while looking up the user."
                        });
                }
                else if (!user) {
                    res.status(406).send(
                        {
                            "success": false,
                            "msg": "User not found. Are you fucking up the server?"
                        });
                }
                else {
                    res.status(200).send(
                        {
                            "success": true,
                            "user": {
                                "name": user.name,
                                "lastName": user.lastName,
                                "email": user.email,
                                "itemsWatching": user.itemsWatching,
                                "itemsSelling": user.itemsSelling,
                                "admin": user.admin
                            }
                        });
                }
            });
    });
    userRouter.post("/unwatch", function (req, res) {
        // console.log(req.body);
        User.findOne(
            { "email": req.decoded.email },
            function (error, user) {
                if (error) {
                    res.status(500).send(
                        {
                            "success": false,
                            "msg": "There was an error while looking up the user."
                        });
                }
                else if (!user) {
                    res.status(406).send(
                        {
                            "success": false,
                            "msg": "This should never happen...wtf?"
                        });
                }
                else {
                    var index = user.itemsWatching.indexOf(req.body.id);
                    if (index > -1) {
                        user.itemsWatching.splice(index, 1);
                        // console.log(user.itemsWatching[index]);
                        user.save((errorSavingUser) => {
                            if (errorSavingUser)
                                res.status(500).send({ "success": false, "msg": "Apparently we cannot code." });
                            else
                                res.status(200).send({
                                    "success": true, "msg": "Item deleted from your watchlist"
                                });
                        });
                    } else {
                        res.status(200).send({
                            "success": false,
                            "msg": "Are you messing me up u little bastard?"
                        });
                    }
                }
            });
    });


    userRouter.post("/addToWishist", function (req, res) {
        Product.findById(req.body.id, function (err, product) {
            if (err) {
                res.status(500).send(
                    {
                        "success": false,
                        "msg": "There was an error while looking up the product."
                    });
            }
            else if (!product) {
                res.status(406).send(
                    {
                        "success": false,
                        "msg": "Are you tinkering with the server? Product not found."
                    });
            } else {
                User.findOne({ "email": req.decoded.email }, (error, user) => {
                    if (error) {
                        res.status(500).send(
                            {
                                "success": false,
                                "msg": "There was an error while looking up the user."
                            });
                    } else if (!user) {
                        res.status(406).send({
                            "success": false,
                            "msg": "This should never happen...wtf? Apparently we cannot find you in the db."
                        });
                    } else {
                        //Everything is ok
                        if (user.itemsWatching.indexOf(mongoose.Types.ObjectId(req.body.id)) > -1) {
                            res.status(200).send({
                                "success": false,
                                "msg": "You are already watching the item."
                            });
                        }
                        else {
                            user.itemsWatching.push(mongoose.Types.ObjectId(req.body.id));
                            user.save((errorSavingUser) => {
                                if (errorSavingUser)
                                    res.status(500).send({ "success": false, "msg": "Apparently I cannot code." });
                                else
                                    res.status(200).send({
                                        "success": true, "msg": "Item added to your watchlist."
                                    });
                            });
                        }
                    }
                });
            }
        });

    });
    return userRouter;
})();