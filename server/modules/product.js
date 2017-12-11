var mongoose = require('mongoose');
var User = require("./user");
var Schema = mongoose.Schema; var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'myfreakinmailer@gmail.com',
        pass: require("./config").trasportedPW
    }
});

var pro = new Schema({
    "name": {
        "type": String, "required": true
    },
    "description": {
        "type": String, "required": true
    },
    "category": {
        "type": String, "required": false
    },
    "weight": {
        "type": Number, "required": true
    },
    "price": {
        "type": Number, "required": true
    },
    "quantity": {
        "type": Number, "required": true
    },
    "img": {
        "type": [String], "required": false
    },
    "seller": { "type": Schema.ObjectId, "ref": "User" },
    "deleted": { "type": Boolean, "default": false },
    "insertionDate": { "type": Number, "default": Date.now() }
});

pro.pre("save", function (next) {
    if (!this.isNew && this.isModified("quantity") && this.quantity < 5) {
        var mailOptions =
            {
                from: 'myfreakinmailer@gmail.com',
                to: "",
                subject: 'Information',
                text: ""
            };
        User.findById(this.seller).exec(function (error, seller) {
            mailOptions.to = seller.email;
            mailOptions.text = "Dear, " + seller.name + ",we kindly inform you that your buissiness is going well and the remains of " + this.name + " are under 5 units."
            if (require("./config").env==="dev") {
                console.log("Mailing the following after the update: " + mailOptions.to);
            } else {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        });
    }
    next();
});

var Product = mongoose.model('Product', pro);

module.exports = Product;