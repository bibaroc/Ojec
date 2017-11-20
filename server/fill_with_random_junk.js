'use strict';

var mongoose = require("mongoose");
var conf = require("./modules/config");
var Product = require('./modules/product');
var User = require('./modules/user');
var crypto = require("crypto");

/////////////////////////////////////////////////////
//SETTING UP DEPENDENCIES
/////////////////////////////////////////////////////
var names = ["Alpaca", "Pepe", "Doge", "Frog", "LeekSpin", "Cat", "Cow", "Dog", "Mouse", "Sonic", "Rat", "Sheldon"];
var productIDs = [];

mongoose.connect(conf.database, conf.databaseOptions);
var seller = new User(
    {
        "name": "Vladyslav",
        "lastName": "Sulimovskyy",
        "email": "sulimovskyy.vladyslav@gmail.com",
        "hash": crypto.createHash("sha256").update("shit").digest("hex"),
        "admin": true, //Admin stands for seller
        "itemsWatching": [],
        "itemsSelling": [],
        "cart": [],
        "pastTransactions": [],
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet velit imperdiet eros semper porta. In pellentesque blandit sem vel sollicitudin. Quisque sed ligula sed nisl congue egestas in non elit. Vivamus at dictum nibh. Sed id eros eu urna rutrum pharetra pellentesque id dui. Integer convallis eros eu odio luctus, ut facilisis arcu pellentesque. Ut vehicula volutpat scelerisque. In dapibus nibh sed erat ultricies convallis. Proin mattis vehicula porta. Donec eget erat molestie, fringilla leo eget, maximus odio. Maecenas ut risus quis massa sodales porttitor sagittis in felis. Donec in nisl quis justo egestas pellentesque eget eget libero. Sed in sagittis felis. Nulla facilisi. Proin commodo risus neque, sit amet finibus tellus semper id. Aliquam pulvinar sed ligula sit amet vehicula.",
        "companyname": "SULIMOVSKYY SRL"
    });
console.log("There should be: " + names.length + " products in the db.");
names.forEach((name) => {
    var pro = new Product({
        "name": name,
        "description": ("+++ " + name + "Description ").repeat(10),
        "category": "",
        "weight": names.indexOf(name) + 1,
        "price": names.indexOf(name) + 1,
        "quantity": names.indexOf(name) + 1,
        "img": ["uploads/" + name.toLowerCase() + "0.jpg", "uploads/" + name.toLowerCase() + "1.jpg", "uploads/" + name.toLowerCase() + "2.jpg"],
        "seller": seller._id
    });
    pro.save((errorSaving) => {
        if (errorSaving)
            console.log(errorSaving);
        else {
            seller.itemsSelling.push(pro._id);
            console.log(names.indexOf(name) + " has done.");
            if (seller.itemsSelling.length === names.length) {
                console.log("I've finished importing files, now I only need to save the user.");
                seller.save((err) => {
                    if (err)
                        console.log(err);
                    else
                        console.log("Seller saved, data filled.");
                });
            }
        }
    });
});
