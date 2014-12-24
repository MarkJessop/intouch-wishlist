var mongoose = require('mongoose');
var item = require('./item');
var card = require('./card');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    name: String,
    email: {type: String, unique: true},
    password: String,
    address: String,
    city: String,
    province: String,
    country: String,
    postal_code: String,
    items: [item.itemSchema],
    card: [card.cardSchema]
});

var User = mongoose.model('User', userSchema);

module.exports = User;