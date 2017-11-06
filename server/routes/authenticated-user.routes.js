var User = require("../modules/user");
var Product = require("../modules/product");
var Transaction = require("../modules/transaction");
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
    userRouter.post("/updateItem", function (req, res) {
        User.findOne({ "email": req.decoded.email }, function (errorLookingUpUser, user) {
            if (errorLookingUpUser) {
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
                        "msg": "Are you tinkering with the server? User not found."
                    });
            }
            else {
                //user found
                Product.findById(mongoose.Types.ObjectId(req.body.id), function (errorLookingUpProduct, prod) {
                    if (errorLookingUpProduct)
                        return res.status(500).send(
                            {
                                "success": false,
                                "msg": "There was an error while looking up the product."
                            });
                    else if (!prod)
                        return res.status(406).send(
                            {
                                "success": false,
                                "msg": "Are you tinkering with the server? Product not found."
                            });
                    else {
                        //D stands for delete
                        if (req.body.flag === "d") {
                            var found = false;
                            user.cart.forEach(function (element) {
                                if (element.item == req.body.id) {
                                    found = true;
                                    user.cart.splice(user.cart.indexOf(element), 1);
                                    user.save((errorSavingUser) => {
                                        if (errorSavingUser) {
                                            return res.status(500).send({
                                                "success": false,
                                                "msg": "Error saving changes to the user."
                                            });
                                        }
                                        else {
                                            return res.status(200).send({
                                                "success": true,
                                                "msg": prod.name + " was removed from your cart."
                                            });
                                        }
                                    });
                                }
                            });
                            //Here the flag was to delete but there item marked for death was not in the users cart
                            if (!found) {
                                return res.status(200).send({
                                    "success": false,
                                    "msg": "The item you said to remove from your cart was not in your cart in the first place."
                                });
                            }
                        }
                        //U stands for update
                        else if (req.body.flag === "u") {
                            var found = false;
                            user.cart.forEach(function (element) {
                                if (element.item == req.body.id) {
                                    found = true;
                                    if (req.body.qnt > prod.quantity) {
                                        res.status(200).send({
                                            "success": true,
                                            "msg": "Trying to add more items to the cart than there are available? I shit you not."
                                        });
                                    } else {
                                        element.qnt = req.body.qnt;
                                        user.save((errorSavingUser) => {
                                            if (errorSavingUser) {
                                                return res.status(500).send({
                                                    "success": false,
                                                    "msg": "Error saving changes to the user."
                                                });
                                            }
                                            else {
                                                return res.status(200).send({
                                                    "success": true,
                                                    "msg": prod.name + " was updated."
                                                });
                                            }
                                        });
                                    }

                                }
                            });
                            //Here the flag was to delete but there item marked for death was not in the users cart
                            if (!found) {
                                return res.status(200).send({
                                    "success": false,
                                    "msg": "The item you said to update the ammount of was not in your cart in the first place."
                                });

                            }
                        }

                    }
                });

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

    userRouter.post("/buy", function (req, res) {
        User.findOne({ "email": req.decoded.email }).populate("cart.item").exec((error, userPopulated) => {
            //As you can see i've stopped caring
            if (error) {
                return res.status(500).send({
                    "success": false,
                    "msg": error.message
                });
            } else if (!userPopulated) {
                return res.status(400).send({
                    "success": false,
                    "msg": "User not found."
                });
            } else {
                //User found and cart populated
                var trans = new Transaction({
                    "buyer": userPopulated._id,
                    "items": [],
                    "date": Date.now()
                });
                userPopulated.cart.forEach(function (element) {
                    trans.items.push({
                        "item": element.item,
                        "qnt": element.qnt,
                        "price": element.item.price
                    });
                });
                trans.save(function (errorSavingTransaction) {
                    if (errorSavingTransaction) {
                        return res.status("500").send({
                            "success": false,
                            "msg": errorSavingTransaction.message
                        });
                    } else {
                        userPopulated.cart = [];
                        userPopulated.pastTransactions.push(trans);
                        userPopulated.save(function (errorSavingUser) {
                            if (errorSavingUser) {
                                return res.status("500").send({
                                    "success": false,
                                    "msg": errorSavingUser
                                });
                            } else {
                                return res.status(200).send({
                                    "success": true,
                                    "msg": "POOF! Magic happens, check the items at your door."
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    return userRouter;
}());