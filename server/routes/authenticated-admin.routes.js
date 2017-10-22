module.exports = (function () {
    'use strict';
    var adminRouter = require("express").Router();
    var mongoose = require('mongoose');
    var User = require("../modules/user");
    var Product = require("../modules/product");

    //Multer configuration
    var multer = require('multer');
    var fs = require('fs');
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            fs.stat("../client/uploads/" + req.decoded.email.split('@')[0], function (err, stats) {
                if (err) {
                    // Directory doesn't exist or something.
                    fs.mkdir("../client/uploads/" + req.decoded.email.split('@')[0]);
                    cb(null, "../client/uploads/" + req.decoded.email.split('@')[0]);
                } else if (!stats.isDirectory()) {
                    // This isn't a directory!
                    console.log('temp is not a directory!');
                } else {
                    cb(null, "../client/uploads/" + req.decoded.email.split('@')[0]);
                }
            });
        },
        filename: function (req, file, cb) {
            cb(null, Math.floor(Math.random() * (32767 - 1) + 1) + "." + Date.now() + '.png');
        }
    });
    var upload = multer({ storage: storage });

    //Mailer Configuration
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'myfreakinmailer@gmail.com',
            pass: '###########'
        }
    });

    adminRouter.get("/", (req, res) => {
        res.send(
            {
                "success": true,
                "msg": "You logged in as an admin."
            });
    });

    adminRouter.post("/addProduct", upload.any(), (req, res) => {

        var product = new Product({
            "name": req.body.name,
            "description": req.body.description,
            "category": "",
            "weight": parseFloat(req.body.weight),
            "price": parseFloat(req.body.price),
            "quantity": parseInt(req.body.quantity),
            "img": [],
        });
        for (var i = 0; i < req.files.length; i++) {
            product.img.push(req.files[i].destination.slice(10) + '/' + req.files[i].filename);
        }
        var Errors = [];
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
                            "msg": "User not found: " + req.decoded.email
                        });
                }
                else {
                    //Setting the seller of the product
                    product.seller = mongoose.Types.ObjectId(user._id);
                    //Adding a product to the sellers list
                    user.itemsSelling.push(mongoose.Types.ObjectId(product._id));
                    //Saving products
                    user.save((errSavingUser) => {
                        if (errSavingUser) {
                            Errors.push(errSavingUser);
                            console.log(rerrSavingUser);
                        }
                        // else
                        //    console.log(user);
                    });
                    product.save((errSavingProducts) => {
                        if (errSavingProducts) {
                            Errors.push(errSavingProducts);
                            console.log(errSavingProducts);
                        }
                        // else
                        //    console.log(product);
                    });
                }
            });
        if (Errors.length == 0) {
            res.status(200).send({
                "success": true,
                "msg": "Product addes to the db."
            });
        }
        else {
            var mss = "";
            Errors.forEach(function (i) {
                mss += "++++++++++" + i.message + "\r\n";
            });
            res.status(500).send({
                "success": false,
                "msg": mss
            });
        }
    });

    adminRouter.post("/deleteItem", function (req, res) {
        User.findOne({ "email": req.decoded.email }, function (errorLookingUpSeller, seller) {
            if (errorLookingUpSeller) {
                res.status(500).send(
                    {
                        "success": false,
                        "msg": "There was an error while looking ypou up."
                    });
            }
            else if (!seller) {
                res.status(406).send(
                    {
                        "success": false,
                        "msg": "Seller not found: " + req.decoded.email + " . Should never happen."
                    });
            }
            else {
                //Found the seller.
                if (seller.itemsSelling.indexOf(mongoose.Types.ObjectId(req.body.id)) > -1) {
                    //He actualy sells the item
                    Product.findById(req.body.id, function (errorLookingUpProduct, productFound) {
                        if (errorLookingUpProduct) {
                            res.status(500).send(
                                {
                                    "success": false,
                                    "msg": "There was an error while looking up the product you are trying to delete."
                                });
                        }
                        else if (!productFound) {
                            res.status(406).send(
                                {
                                    "success": false,
                                    "msg": "Apparently we are not able to find the product you are trying to delete."
                                });
                        } else {
                            //Certain of the poroduct and of the seller
                            seller.itemsSelling.splice(seller.itemsSelling.indexOf(mongoose.Types.ObjectId(req.body.id)), 1);
                            // if (seller.itemsWatching.indexOf(mongoose.Types.ObjectId(req.body.id)) > -1)
                            //     seller.itemsWatching.splice(seller.itemsWatching.indexOf(mongoose.Types.ObjectId(req.body.id)), 1);
                            productFound.remove((errorRemoving) => {
                                if (errorRemoving)
                                    res.status(500).send(
                                        {
                                            "success": false,
                                            "msg": "There was an error while removing the document."
                                        });
                                else {
                                    seller.save(function (errorSavingUser) {
                                        if (errorSavingUser)
                                            res.status(500).send(
                                                {
                                                    "success": false,
                                                    "msg": "There was an error while removing the document."
                                                });
                                        else {
                                            //Document removed and seller updated and saved.
                                            User.find({$or:[{ "itemsWatching": mongoose.Types.ObjectId(req.body.id) }, { "cart": mongoose.Types.ObjectId(req.body.id) }]}, function (err, userList) {
                                                // console.log(userList);
                                                if (err)
                                                    res.status(500).send({
                                                        "success": true,
                                                        "msg": "Item currently removed and you information updated but crashed while looking up subscribers."
                                                    });
                                                else {
                                                    var mailOptions = {
                                                        from: 'myfreakinmailer@gmail.com',
                                                        to: "",
                                                        subject: 'Information',
                                                        text: 'Dear Customer, we kindly inform you that an item you were watching was removed from our website by his owner.'
                                                    };
                                                    userList.forEach((subscriber) => {
                                                        //Remove the item from the watchlist
                                                        if (subscriber.itemsWatching.indexOf(mongoose.Types.ObjectId(req.body.id)) > -1)
                                                            subscriber.itemsWatching.splice(subscriber.itemsWatching.indexOf(mongoose.Types.ObjectId(req.body.id)), 1);
                                                        else if (subscriber.cart.indexOf(mongoose.Types.ObjectId(req.body.id)) > -1)
                                                            subscriber.cart.splice(subscriber.cart.indexOf(mongoose.Types.ObjectId(req.body.id)), 1);
                                                        if (userList.indexOf(subscriber) == 0)
                                                            mailOptions.to += subscriber.email;
                                                        else
                                                            mailOptions.to += ", " + subscriber.email;
                                                        if (userList.indexOf(subscriber) + 1 == userList.length) {
                                                            // console.log(mailOptions);
                                                            transporter.sendMail(mailOptions, function (error, info) {
                                                                if (error) {
                                                                    console.log(error);
                                                                }
                                                            });
                                                        }
                                                        subscriber.save((error) => {
                                                            if (error)
                                                                console.log(error);
                                                        });
                                                    });
                                                }
                                            });
                                            res.status(200).send({
                                                "success": true,
                                                "msg": "Item currently removed, your personal info updated and potential buyers will be notified soon(ish)."
                                            });
                                        }
                                    });
                                }
                            });

                        }
                    });
                } else {
                    res.status(200).send({
                        "success": false,
                        "msg": "Are you tinkering with the server? Trying to delete items you dont own?"
                    });
                }
            }
        });
    });


    adminRouter.post("/updateItem", (req, res) => {
        User.findOne({ "email": req.decoded.email }, (errorSearchingUser, seller) => {
            if (errorSearchingUser)
                res.status(500).send({
                    "success": false,
                    "msg": "Apparently I cant code for shits and giggles"
                });
            else if (!seller)
                res.status(400).send({
                    "success": false,
                    "msg": "Apparently we cannot find you in out db, are you ure you are a certified seller?"
                });
            else {
                var itemID = mongoose.Types.ObjectId(req.body.id);
                if (seller.itemsSelling.indexOf(itemID) > -1) {
                    //He should own the item....
                    Product.findById(itemID, (errorSearchingProduct, product) => {
                        if (errorSearchingProduct)
                            res.status(500).send({
                                "success": false,
                                "msg": "Seems like i cant code for shit"
                            });
                        else if (!product)
                            res.status(400).send({
                                "success": false,
                                "msg": "We cannot find the item you are looking to update"
                            });
                        else {
                            //Update product unconditionaly
                            product.name = req.body.name;
                            product.description = req.body.description;
                            product.quantity = parseInt(req.body.quantity);
                            product.price = parseFloat(req.body.price);
                            product.weight = parseFloat(req.body.weight);
                            product.save((errorSaving) => {
                                if (errorSaving)
                                    res.status(500).send({
                                        "success": false,
                                        "msg": "well fking done vlad"
                                    });
                                else {
                                    //Product Saved successfuly
                                    var mailOptions = {
                                        from: 'myfreakinmailer@gmail.com',
                                        to: "",
                                        subject: 'Information',
                                        text: 'Dear Customer, we kindly inform you that an item you were watching was updated bu his owner and we invite you to take a look.'
                                    };
                                    User.find({$or:[{ "itemsWatching": itemID }, { "cart": itemsID }]}, (error, subscribers) => {
                                        if (error)
                                            res.status(500).send({
                                                "success": false,
                                                "msg": "repetition, repetition"
                                            });
                                        else {
                                            subscribers.forEach((unit) => {
                                                if (subscribers.indexOf(unit) === 0)
                                                    mailOptions.to += unit.email;
                                                else
                                                    mailOptions.to += ", " + unit.email
                                                if (subscribers.indexOf(unit) + 1 === subscribers.length)
                                                    transporter.sendMail(mailOptions, function (error, info) {
                                                        if (error) {
                                                            console.log(error);
                                                        } else {
                                                            console.log('Email sent: ' + info.response);
                                                        }
                                                    });
                                            });
                                        }
                                    });
                                    res.status(200).send({
                                        "success": true,
                                        "msg": "Desired product updated and potential buyers will be notified soon(ish)."
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    });
    return adminRouter;
})();