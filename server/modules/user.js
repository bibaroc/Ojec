var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.model('User', new Schema({
    "name": String,
    "lastName": String,
    "email": {
        "type": String, "unique": true, "required": true
    },
    "hash": {
        "type": String, "required": true
    },
    "admin": {
        "type": Boolean, "default": false
    },
    "description": {
        "type": String, "required": false
    },
    "companyname": {
        "type": String, "required": false
    },
    "itemsWatching": [{ "type": Schema.ObjectId, "ref": "Product" }],
    "itemsSelling": [{ "type": Schema.ObjectId, "ref": "Product" }],
    "cart": [{
        item: { "type": Schema.ObjectId, "ref": "Product" },
        qnt: { "type": Number, "default": 1 }
    }],
    "pastTransactions": [{ "type": Schema.ObjectId, "ref": "Transaction" }]
}));

module.exports = User;