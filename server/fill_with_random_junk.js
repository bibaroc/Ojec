'use strict';

var mongoose = require("mongoose");
var conf = require("./modules/config");
var Product = require('./modules/product');
var User = require('./modules/user');

/////////////////////////////////////////////////////
//SETTING UP DEPENDENCIES
/////////////////////////////////////////////////////

mongoose.connect(conf.database, conf.databaseOptions);

/////////////////////////////////////////////////////
//BASIC ROUTES, NO NEED FOR AUTHENTICATION,
//ALLOWS FOR LOGIN TO HAPPEN, THEN PROCEED
/////////////////////////////////////////////////////
(new Product({
    "name": "Alpaca",
    "description": "+++AlpacaDescription+++AlpacaDescription+++AlpacaDescription+++AlpacaDescription+++AlpacaDescription+++AlpacaDescription+++AlpacaDescription+++AlpacaDescription+++AlpacaDescription+++AlpacaDescription+++",
    "category": "",
    "weight": 14,
    "price": 3,
    "quantity": 1,
    "img": ["uploads/alpaca0.jpg","uploads/alpaca1.jpg","uploads/alpaca2.jpg"],
    "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
})).save(function (err) {
    if (err) {
        console.log(err.code);
    }
    else {
        (new Product({
            "name": "Pepe",
            "description": "+++PepeDescription+++PepeDescription+++PepeDescription+++PepeDescription+++PepeDescription+++PepeDescription+++PepeDescription+++PepeDescription+++PepeDescription+++PepeDescription+++PepeDescription+++PepeDescription+++",
            "category": "",
            "weight": 1,
            "price": 1,
            "quantity": 1,
            "img": ["uploads/pepe0.jpg", "uploads/pepe1.jpg", "uploads/pepe2.jpg", "uploads/pepe3.jpg"],
            "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
        })).save(function (err) {
            if (err) {
                console.log(err.code);
            }
            else {
                (new Product({
                    "name": "Doge",
                    "description": "DogeDescription+++DogeDescription+++DogeDescription+++DogeDescription+++DogeDescription+++DogeDescription+++DogeDescription+++DogeDescription+++DogeDescription+++DogeDescription+++",
                    "category": "",
                    "weight": 2,
                    "price": 2,
                    "quantity": 2,
                    "img": ["uploads/doge0.jpg", "uploads/doge1.jpg", "uploads/doge2.jpg", "uploads/doge3.jpg"],
                    "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                })).save(function (err) {
                    if (err) {
                        console.log(err.code);
                    }
                    else {
                        (new Product({
                            "name": "Frog",
                            "description": "FrogDescription+++FrogDescription+++FrogDescription+++FrogDescription+++FrogDescription+++FrogDescription+++FrogDescription+++FrogDescription+++FrogDescription+++FrogDescription+++",
                            "category": "",
                            "weight": 3,
                            "price": 3,
                            "quantity": 3,
                            "img": ["uploads/frog0.jpg", "uploads/frog1.jpg", "uploads/frog2.jpg"],
                            "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                        })).save(function (err) {
                            if (err) {
                                console.log(err.code);
                            }
                            else {
                                (new Product({
                                    "name": "LeekSpin",
                                    "description": "LeekSpinDescription+++LeekSpinDescription+++LeekSpinDescription+++LeekSpinDescription+++LeekSpinDescription+++LeekSpinDescription+++LeekSpinDescription+++LeekSpinDescription+++LeekSpinDescription+++LeekSpinDescription+++",
                                    "category": "",
                                    "weight": 4,
                                    "price": 4,
                                    "quantity": 4,
                                    "img": ["uploads/leek0.jpg", "uploads/leek1.jpg", "uploads/leek2.jpg"],
                                    "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                                })).save(function (err) {
                                    if (err) {
                                        console.log(err.code);
                                    }
                                    else {
                                        (new Product({
                                            "name": "ALL YOUR BASE ARE BELONG TO US",
                                            "description": "ALL YOUR BASE ARE BELONG TO USALL YOUR BASE ARE BELONG TO USALL YOUR BASE ARE BELONG TO USALL YOUR BASE ARE BELONG TO USALL YOUR BASE ARE BELONG TO USALL YOUR BASE ARE BELONG TO USALL YOUR BASE ARE BELONG TO USALL YOUR BASE ARE BELONG TO USALL YOUR BASE ARE BELONG TO USALL YOUR BASE ARE BELONG TO US",
                                            "category": "",
                                            "weight": 6,
                                            "price": 6,
                                            "quantity": 6,
                                            "img": ["uploads/base0.jpg", "uploads/base1.jpg", "uploads/base2.jpg"],
                                            "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                                        })).save(function (err) {
                                            if (err) {
                                                console.log(err.code);
                                            }
                                            else {
                                                (new Product({
                                                    "name": "Cat",
                                                    "description": "catDescription+++catDescription+++catDescription+++catDescription+++catDescription+++catDescription+++catDescription+++catDescription+++catDescription+++catDescription+++",
                                                    "category": "",
                                                    "weight": 7,
                                                    "price": 7,
                                                    "quantity": 7,
                                                    "img": ["uploads/cat0.jpg", "uploads/cat1.jpg", "uploads/cat2.jpg"],
                                                    "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                                                })).save(function (err) {
                                                    if (err) {
                                                        console.log(err.code);
                                                    }
                                                    else {
                                                        (new Product({
                                                            "name": "Cow",
                                                            "description": "cowDescription+++cowDescription+++cowDescription+++cowDescription+++cowDescription+++cowDescription+++cowDescription+++cowDescription+++cowDescription+++cowDescription+++",
                                                            "category": "",
                                                            "weight": 8,
                                                            "price": 8,
                                                            "quantity": 8,
                                                            "img": ["uploads/cow0.jpg", "uploads/cow1.jpg", "uploads/cow2.jpg"],
                                                            "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                                                        })).save(function (err) {
                                                            if (err) {
                                                                console.log(err.code);
                                                            }
                                                            else {
                                                                (new Product({
                                                                    "name": "Dog",
                                                                    "description": "dogDescription+++dogDescription+++dogDescription+++dogDescription+++dogDescription+++dogDescription+++dogDescription+++dogDescription+++dogDescription+++dogDescription+++",
                                                                    "category": "",
                                                                    "weight": 9,
                                                                    "price": 9,
                                                                    "quantity": 9,
                                                                    "img": ["uploads/dog0.jpg", "uploads/dog1.jpg", "uploads/dog2.jpg"],
                                                                    "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                                                                })).save(function (err) {
                                                                    if (err) {
                                                                        console.log(err.code);
                                                                    }
                                                                    else {
                                                                        (new Product({
                                                                            "name": "Mouse",
                                                                            "description": "mouseDescription+++mouseDescription+++mouseDescription+++mouseDescription+++mouseDescription+++mouseDescription+++mouseDescription+++mouseDescription+++mouseDescription+++mouseDescription+++",
                                                                            "category": "",
                                                                            "weight": 10,
                                                                            "price": 10,
                                                                            "quantity": 10,
                                                                            "img": ["uploads/mouse0.jpg", "uploads/mouse1.jpg", "uploads/mouse2.jpg"],
                                                                            "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                                                                        })).save(function (err) {
                                                                            if (err) {
                                                                                console.log(err.code);
                                                                            }
                                                                            else {
                                                                                (new Product({
                                                                                    "name": "Sonic",
                                                                                    "description": "sonicDescription+++sonicDescription+++sonicDescription+++sonicDescription+++sonicDescription+++sonicDescription+++sonicDescription+++sonicDescription+++sonicDescription+++sonicDescription+++",
                                                                                    "category": "",
                                                                                    "weight": 11,
                                                                                    "price": 11,
                                                                                    "quantity": 11,
                                                                                    "img": ["uploads/sonic0.jpg", "uploads/sonic1.jpg", "uploads/sonic2.jpg"],
                                                                                    "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                                                                                })).save(function (err) {
                                                                                    if (err) {
                                                                                        console.log(err.code);
                                                                                    }
                                                                                    else {
                                                                                        (new Product({
                                                                                            "name": "Rat",
                                                                                            "description": "ratDescription+++ratDescription+++ratDescription+++ratDescription+++ratDescription+++ratDescription+++ratDescription+++ratDescription+++ratDescription+++ratDescription+++",
                                                                                            "category": "",
                                                                                            "weight": 12,
                                                                                            "price": 12,
                                                                                            "quantity": 12,
                                                                                            "img": ["uploads/rat0.jpg", "uploads/rat1.jpg", "uploads/rat2.jpg"],
                                                                                            "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                                                                                        })).save(function (err) {
                                                                                            if (err) {
                                                                                                console.log(err.code);
                                                                                            }
                                                                                            else {
                                                                                                (new Product({
                                                                                                    "name": "Sheldon",
                                                                                                    "description": "SheldonDescription+++SheldonDescription+++SheldonDescription+++SheldonDescription+++SheldonDescription+++SheldonDescription+++SheldonDescription+++SheldonDescription+++SheldonDescription+++SheldonDescription+++",
                                                                                                    "category": "",
                                                                                                    "weight": 5,
                                                                                                    "price": 5,
                                                                                                    "quantity": 5,
                                                                                                    "img": ["uploads/sheldon0.jpg", "uploads/sheldon1.jpg", "uploads/sheldon2.jpg"],
                                                                                                    "seller": mongoose.Types.ObjectId("59dcaed8cfda052254771577")
                                                                                                })).save(function (err) {
                                                                                                    if (err) {
                                                                                                        console.log(err.code);
                                                                                                    }
                                                                                                    else {
                                                                                                        console.log("ok");
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});
