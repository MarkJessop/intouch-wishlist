var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
    number: String,
    exp_month: Number,
    exp_year: Number,
    cvc: Number,
    name: String
})

var Card = mongoose.model('card', cardSchema)

module.exports = {
    cardSchema: cardSchema,
    Card: Card
};