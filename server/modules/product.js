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
        "type": String, "required": true
    },
    "weight": {
        "type": String, "required": true
    }
}));

module.exports = User;