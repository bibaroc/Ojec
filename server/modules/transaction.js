var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Transaction = mongoose.model('Transaction', new Schema({
    "buyer": { "type": Schema.ObjectId, "ref": "User", "required": true },
    "items": [
        {
            "item": { "type": Schema.ObjectId, "ref": "Product", "required": true },
            "qnt": { "type": Number, "required": true },
            "price": { "type": Number, "required": true }
        }
    ],
    "date": { "type": Number, "default": Date.now() }
}));

module.exports = Transaction;