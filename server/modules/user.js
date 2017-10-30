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
    "itemsWatching": [Schema.ObjectId],
    "itemsSelling": [Schema.ObjectId],
    "cart": [{
        item: Schema.ObjectId,
        qnt: Number
    }]
}));

module.exports = User;