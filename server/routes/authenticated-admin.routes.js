module.exports = (function () {
    'use strict';
    var adminRouter = require("express").Router();
    var fs = require('fs');
    var mongoose = require('mongoose');
    var User = require("../modules/user");
    var Product = require("../modules/product");

    //Multer configuration
    var multer = require('multer');
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
    // var nodemailer = require('nodemailer');
    // var transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: 'vladyslavbbb@gmail.com',
    //     pass: '#########'
    //   }
    // });

    // var mailOptions = {
    //     from: 'youremail@gmail.com',
    //     to: 'myfriend@yahoo.com',
    //     subject: 'Sending Email using Node.js',
    //     text: 'That was easy!'
    //   };

    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });

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
                //Found the seller.20
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
                                            User.find({ "itemsWatching": mongoose.Types.ObjectId(req.body.id) }, function (err, userList) {
                                                if (err)
                                                    res.status(500).send({
                                                        "success": true,
                                                        "msg": "Item currently removed and you information updated but crashed while looking up subscribers."
                                                    });
                                                else {
                                                    //Send an email to every subscriber
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
    return adminRouter;
})();