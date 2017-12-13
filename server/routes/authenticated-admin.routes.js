module.exports = (function () {
    'use strict';
    var adminRouter = require("express").Router();
    var mongoose = require('mongoose');
    var User = require("../modules/user");
    var Product = require("../modules/product");
    //Mailer Configuration
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'myfreakinmailer@gmail.com',
            pass: require("../modules/config").trasportedPW
        }
    });

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

    adminRouter.get("/", function (req, res) {
        return res.send(
            {
                "success": true,
                "msg": "You logged in as an admin."
            });
    });

    adminRouter.post("/addProduct", upload.any(), function (req, res) {

        var product = new Product({
            "name": req.body.name.toUpperCase(),
            "description": req.body.description,
            "category": "",
            "weight": parseFloat(req.body.weight),
            "price": parseFloat(req.body.price),
            "quantity": parseInt(req.body.quantity),
            "img": [],
            "deleted": false
        });
        // console.log(product);
        var i = 0;
        for (i = 0; i < req.files.length; i += 1) {
            product.img.push(req.files[i].destination.slice(10) + '/' + req.files[i].filename);
        }
        var Errors = [];
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
                } else if (!user) {
                    return res.status(406).send(
                        {
                            "success": false,
                            "msg": "User not found: " + req.decoded.email
                        });
                } else {
                    //Setting the seller of the product
                    product.seller = mongoose.Types.ObjectId(user._id);
                    //Adding a product to the sellers list
                    user.itemsSelling.push(mongoose.Types.ObjectId(product._id));
                    //Saving products
                    user.save(function (errSavingUser) {
                        if (errSavingUser) {
                            Errors.push(errSavingUser);
                            console.log(errSavingUser);
                        }
                        // else
                        //    console.log(user);
                    });
                    product.save(function (errSavingProducts) {
                        if (errSavingProducts) {
                            Errors.push(errSavingProducts);
                            console.log(errSavingProducts);
                        }
                        // else
                        //    console.log(product);
                    });
                }
            });
        if (Errors.length === 0) {
            return res.status(200).send({
                "success": true,
                "msg": "Product addes to the db."
            });
        } else {
            var mss = "";
            Errors.forEach(function (i) {
                mss += "++++++++++" + i.message + "\r\n";
            });
            return res.status(500).send({
                "success": false,
                "msg": mss
            });
        }
    });


    adminRouter.post("/deleteItem", function (req, res) {
        User.findOne({ "email": req.decoded.email }, function (errorLookingUpSeller, seller) {
            if (errorLookingUpSeller) {
                return res.status(500).send(
                    {
                        "success": false,
                        "msg": "There was an error while looking ypou up."
                    });
            } else if (!seller) {
                return res.status(406).send(
                    {
                        "success": false,
                        "msg": "Seller not found: " + req.decoded.email + " . Should never happen."
                    });
            } else {
                //Found the seller.
                var productToDelete = mongoose.Types.ObjectId(req.body.id);
                if (seller.itemsSelling.indexOf(productToDelete) > -1) {
                    //He actualy sells the item
                    Product.findById(req.body.id, function (errorLookingUpProduct, productFound) {
                        if (errorLookingUpProduct) {
                            return res.status(500).send(
                                {
                                    "success": false,
                                    "msg": "There was an error while looking up the product you are trying to delete."
                                });
                        } else if (!productFound) {
                            return res.status(406).send(
                                {
                                    "success": false,
                                    "msg": "Apparently we are not able to find the product you are trying to delete."
                                });
                        } else {
                            //Certain of the poroduct and of the seller
                            seller.itemsSelling.splice(seller.itemsSelling.indexOf(productToDelete), 1);
                            // if (seller.itemsWatching.indexOf(productToDelete) > -1)
                            //     seller.itemsWatching.splice(seller.itemsWatching.indexOf(productToDelete), 1);
                            productFound.name = "ITEM DELETED";
                            productFound.description = "THIS ITEM WAS DELETED BY HIS OWNER";
                            productFound.quantity = 0;
                            productFound.price = 999;
                            productFound.weight = 999;
                            productFound.deleted = true;
                            productFound.img = ["/uploads/deleted.png"];
                            productFound.save(function (errorRemoving) {
                                if (errorRemoving) {
                                    return res.status(500).send(
                                        {
                                            "success": false,
                                            "msg": "There was an error while removing the document."
                                        });
                                } else {
                                    seller.save(function (errorSavingUser) {
                                        if (errorSavingUser) {
                                            return res.status(500).send(
                                                {
                                                    "success": false,
                                                    "msg": "There was an error while removing the document."
                                                });
                                        } else {
                                            //Document removed and seller updated and saved.
                                            User.find({ $or: [{ "itemsWatching": productToDelete }, { "cart.item": productToDelete }] }, function (err, userList) {
                                                // console.log(userList);
                                                if (err) {
                                                    return res.status(500).send({
                                                        "success": true,
                                                        "msg": "Item currently removed and you information updated but crashed while looking up subscribers."
                                                    });
                                                } else {
                                                    var mailOptions = {
                                                        from: 'myfreakinmailer@gmail.com',
                                                        to: "",
                                                        subject: 'Information',
                                                        text: 'Dear Customer, we kindly inform you that an item you were watching was removed from our website by his owner.'
                                                    };
                                                    userList.forEach(function (subscriber) {
                                                        //Remove the item from the watchlist if any
                                                        if (subscriber.itemsWatching.indexOf(productToDelete) > -1) {
                                                            subscriber.itemsWatching.splice(subscriber.itemsWatching.indexOf(productToDelete), 1);
                                                        }
                                                        //Remove from cart
                                                        subscriber.cart.forEach(function (element) {
                                                            if (element.item == req.body.id) {
                                                                subscriber.cart.splice(subscriber.cart.indexOf(productToDelete), 1);
                                                            }
                                                        });
                                                        //Add Email to the mail list
                                                        if (userList.indexOf(subscriber) === 0) {
                                                            mailOptions.to += subscriber.email;
                                                        } else {
                                                            mailOptions.to += ", " + subscriber.email;
                                                        }
                                                        //Last user
                                                        if (userList.indexOf(subscriber) + 1 === userList.length) {
                                                            if (require("../modules/config").env === "dev") {
                                                                console.log("Mailing the following after the deletion: " + mailOptions.to);
                                                            } else {
                                                                transporter.sendMail(mailOptions, function (error, info) {
                                                                    if (error) {
                                                                        console.log(error);
                                                                    }
                                                                });
                                                            }
                                                        }
                                                        subscriber.save(function (error) {
                                                            if (error) {
                                                                console.log(error);
                                                            }
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

    adminRouter.post("/updateItem", function (req, res) {
        User.findOne({ "email": req.decoded.email }, function (errorSearchingUser, seller) {
            if (errorSearchingUser) {
                return res.status(500).send({
                    "success": false,
                    "msg": "Apparently I cant code for shits and giggles"
                });
            } else if (!seller) {
                return res.status(400).send({
                    "success": false,
                    "msg": "Apparently we cannot find you in out db, are you ure you are a certified seller?"
                });
            } else {
                var itemID = mongoose.Types.ObjectId(req.body.id);
                if (seller.itemsSelling.indexOf(itemID) > -1) {
                    //He should own the item....
                    Product.findById(itemID, function (errorSearchingProduct, product) {
                        if (errorSearchingProduct) {
                            return res.status(500).send({
                                "success": false,
                                "msg": "Seems like i cant code for shit."
                            });
                        } else if (!product) {
                            return res.status(400).send({
                                "success": false,
                                "msg": "We cannot find the item you are looking to update."
                            });
                        } else {
                            var qtt = product.quantity;
                            //Update product unconditionaly
                            product.name = req.body.name;
                            product.description = req.body.description;
                            product.quantity = parseInt(req.body.quantity);
                            product.price = parseFloat(req.body.price);
                            product.weight = parseFloat(req.body.weight);
                            product.save(function (errorSaving) {
                                if (errorSaving) {
                                    return res.status(500).send({
                                        "success": false,
                                        "msg": errorSaving.message
                                    });
                                } else {
                                    if (qtt === 0 && product.quantity > 0) {
                                        User.find({ "itemsWatching": itemID }).exec(
                                            function (eee, rrr) {
                                                if (eee) {
                                                    return res.status(500).send({
                                                        "success": false,
                                                        "msg": "repetition, repetition"
                                                    });
                                                } else {
                                                    var eo = {
                                                        from: 'myfreakinmailer@gmail.com',
                                                        to: "",
                                                        subject: 'Information',
                                                        text: 'Dear Customer, we kindly inform you that an item you were watching is now available and we invite you to check it out.'
                                                    };
                                                    rrr.forEach(function (subs, index) {
                                                        if (index === 0) {
                                                            eo.to += subs.email;
                                                        } else {
                                                            eo.to += ", " + subs.email;
                                                        }
                                                        if (index + 1 === rrr.length) {
                                                            if (require("../modules/config").env === "dev") {
                                                                console.log("Mailing the following after the update cuz subsribed: " + eo.to);
                                                            } else {
                                                                transporter.sendMail(eo, function (error, info) {
                                                                    if (error) {
                                                                        console.log(error);
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }

                                            });
                                    }
                                    //Product Saved successfuly
                                    var mailOptions = {
                                        from: 'myfreakinmailer@gmail.com',
                                        to: "",
                                        subject: 'Information',
                                        text: 'Dear Customer, we kindly inform you that an item you were watching was updated bu his owner and we invite you to take a look.'
                                    };
                                    User.find({ $or: [{ "itemsWatching": itemID }, { "cart.item": itemID }] }, function (error, subscribers) {
                                        if (error) {
                                            return res.status(500).send({
                                                "success": false,
                                                "msg": "repetition, repetition"
                                            });
                                        } else {
                                            subscribers.forEach(function (unit) {
                                                if (subscribers.indexOf(unit) === 0) {
                                                    mailOptions.to += unit.email;
                                                } else {
                                                    mailOptions.to += ", " + unit.email;
                                                }
                                                //Last one
                                                if (subscribers.indexOf(unit) + 1 === subscribers.length) {
                                                    if (require("../modules/config").env === "dev") {
                                                        console.log("Mailing the following after the update: " + mailOptions.to);
                                                    } else {
                                                        transporter.sendMail(mailOptions, function (error, info) {
                                                            if (error) {
                                                                console.log(error);
                                                            }
                                                        });
                                                    }
                                                }
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
}());