var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = mongoose.model('Product', new Schema({
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
    "seller": Schema.ObjectId,
}));

module.exports = Product;