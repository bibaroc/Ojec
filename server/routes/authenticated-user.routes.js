var User = require("../modules/user");
var Product = require("../modules/product");
var mongoose = require('mongoose');

module.exports = (function () {
    'use strict';
    var userRouter = require("express").Router();
    userRouter.get("/", function (req, res) {
        res.send(
            {
                'success': true,
                'msg': 'You logged in as a user.'
            });
    });
    userRouter.get("/userInfo", function (req, res) {
        User.findOne(
            {
                "email": req.decoded.email
            },
            function (err, user) {
                if (err) {
                    return res.status(500).send(
                        {
                            "success": false,
                            "msg": "There was an error while looking up the user."
                        });
                }
                else if (!user) {
                    return res.status(406).send(
                        {
                            "success": false,
                            "msg": "User not found. Are you fucking up the server?"
                        });
                }
                else {
                    return res.status(200).send(
                        {
                            "success": true,
                            "user": {
                                "name": user.name,
                                "lastName": user.lastName,
                                "email": user.email,
                                "itemsWatching": user.itemsWatching,
                                "itemsSelling": user.itemsSelling,
                                "cart": user.cart,
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
                    return res.status(500).send(
                        {
                            "success": false,
                            "msg": "There was an error while looking up the user."
                        });
                }
                else if (!user) {
                    return res.status(406).send(
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
                        user.save(function (errorSavingUser) {
                            if (errorSavingUser)
                                return res.status(500).send({ "success": false, "msg": "Apparently we cannot code." });
                            else
                                return res.status(200).send({
                                    "success": true, "msg": "Item deleted from your watchlist"
                                });
                        });
                    } else {
                        return res.status(200).send({
                            "success": false,
                            "msg": "Are you messing me up u little bastard?"
                        });
                    }
                }
            });
    });

    userRouter.post("/addToCart", function (request, response) {
        Product.findById(request.body.id, function (errorLookingUpProduct, product) {
            if (errorLookingUpProduct)
                return response.status(500).send(
                    {
                        "success": false,
                        "msg": "There was an error while looking up the product."
                    });
            else if (!product)
                return response.status(406).send(
                    {
                        "success": false,
                        "msg": "Are you tinkering with the server? Product not found."
                    });
            else {
                if (request.body.qnt > product.quantity)
                    return response.status(406).send(
                        {
                            "success": false,
                            "msg": "Are you tinkering with the server? Trying to add to cart more items than there are available."
                        });
                User.findOne({ "email": request.decoded.email }, function (errorLookingUpUser, user) {
                    if (errorLookingUpUser)
                        return response.status(500).send(
                            {
                                "success": false,
                                "msg": "There was an error while looking up the user."
                            });
                    else if (!user)
                        return response.status(406).send(
                            {
                                "success": false,
                                "msg": "Are you tinkering with the server? User not found."
                            });
                    else {
                        //Product and user found
                        var inCart = false;
                        user.cart.forEach(function (element) {
                            //User already had the item in the cart
                            if (element.item == request.body.id) {
                                inCart = true;
                                element.qnt = element.qnt + request.body.qnt > product.quantity ? product.quantity : element.qnt + request.body.qnt;
                                user.save(function (errorSavingUser) {
                                    if (errorSavingUser)
                                        return response.status(500).send({
                                            "success": false,
                                            "msg": "Error saving changes to the user."
                                        });
                                    else
                                        return response.status(200).send({
                                            "success": true,
                                            "msg": "The item was added to the ones you already had in the cart."
                                        });
                                });
                            }
                        });
                        //There was no item in the cart with the same id
                        if (!inCart) {
                            user.cart.push({ "item": request.body.id, "qnt": request.body.qnt });
                            user.save((errorSavingUser) => {
                                if (errorSavingUser)
                                    return response.status(500).send({
                                        "success": false,
                                        "msg": "Error saving changes to the user."
                                    });
                                else
                                    return response.status(200).send({
                                        "success": true,
                                        "msg": "The item was added to your cart."
                                    });
                            });
                        }
                    }
                });
            }
        });
    });

    userRouter.post("/addToWishist", function (req, res) {
        Product.findById(req.body.id, function (err, product) {
            if (err) {
                return res.status(500).send(
                    {
                        "success": false,
                        "msg": "There was an error while looking up the product."
                    });
            }
            else if (!product) {
                return res.status(406).send(
                    {
                        "success": false,
                        "msg": "Are you tinkering with the server? Product not found."
                    });
            } else {
                User.findOne({ "email": req.decoded.email }, function (error, user) {
                    if (error) {
                        return res.status(500).send(
                            {
                                "success": false,
                                "msg": "There was an error while looking up the user."
                            });
                    } else if (!user) {
                        return res.status(406).send({
                            "success": false,
                            "msg": "This should never happen...wtf? Apparently we cannot find you in the db."
                        });
                    } else {
                        //Everything is ok
                        if (user.itemsWatching.indexOf(mongoose.Types.ObjectId(req.body.id)) > -1) {
                            return res.status(200).send({
                                "success": false,
                                "msg": "You are already watching the item."
                            });
                        }
                        else {
                            user.itemsWatching.push(mongoose.Types.ObjectId(req.body.id));
                            user.save(function (errorSavingUser) {
                                if (errorSavingUser)
                                    return res.status(500).send({ "success": false, "msg": "Apparently I cannot code." });
                                else
                                    return res.status(200).send({ "success": true, "msg": "Item added to your watchlist." });
                            });
                        }
                    }
                });
            }
        });

    });
    return userRouter;
}());