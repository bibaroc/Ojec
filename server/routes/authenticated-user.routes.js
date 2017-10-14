var User = require("../modules/user");
var mongoose = require('mongoose');

module.exports = (function () {
    'use strict';
    var userRouter = require("express").Router();
    //userRouter.use(require("../middlewares/authenticated-user.middleware"));
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
        console.log(req.body);
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
                        console.log(user.itemsWatching[index]);
                        user.save((errorSavingUser) => {
                            if (errorSavingUser)
                                res.send({ "success": false, "msg": "Apparently we cannot code." });
                            else
                                res.send({
                                    "success": true, "msg": "Item deleted from your watchlist"
                                });
                        });
                    } else {
                        res.send({
                            "success": false,
                            "msg": "Are you messing me up u little bastard?"
                        });
                    }
                    // var code = mongoose.Types.ObjectId(req.body.id);
                    // user.itemsWatching = user.itemsWatching.filter((id) => { return id !== req.body.id });
                    // console.log(user.itemsWatching);
                    // user.save((errorSavingUser) => {
                    //     if (errorSavingUser)
                    //         res.send({ "success": false, "msg": "Apparently we cannot code." });
                    //     else
                    //         res.send({
                    //             "success": true, "msg": "Item deleted from your watchlist"
                    //         });
                    // });
                }
            });
    });
    return userRouter;
})();