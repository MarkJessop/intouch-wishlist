var stripe = require('../config/stripe');
var Card = require('../models/card');
var User = require('../models/user');

var addCard = function(req, res){
    var user_id = req.params.user_id;
    User.findOne({'username': user_id}, function(err, user) {
        if (err)
            res.send(500, {error: err.message});
        if (user) {
            var card = new Card.Card({
                number: req.body.number,
                exp_month: req.body.exp_month,
                exp_year: req.body.exp_year,
                cvc: req.body.cvc,
                name: req.body.name
            });


            user.card.pop(); //only save one card
            user.card.push(card);

            user.save(function (err) {
                if (err)
                    res.send(500, {error: err.message})
                else
                    res.json(card);
            });
        }else
            res.send(500, {error: "Unable to find user"})
    });
};

module.exports = {
    addCard : addCard
};