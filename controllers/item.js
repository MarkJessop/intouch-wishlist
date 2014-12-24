var User = require('../models/user');
var Item = require('../models/item');
var prodAdv = require('../config/amazon');
var stripe = require('../config/stripe');

var getItems = function(req, res){
    var user_id = req.params.user_id;

    User.findOne({'username': user_id}, function(err, user){
        if (err)
            res.send(500, {error: err.message})
        else if (user)
            res.json(user.items);
        else
            res.send(500, {error: "Unable to find user"})
    });
};

var addItem = function (req, res){
    var user_id = req.params.user_id;

    User.findOne({'username': user_id}, function(err, user){
        if (err)
            res.send(500, {error: err.message})

        var item = new Item.Item({
            price: req.body.price,
            amazon_id: req.body.amazon_id
        });

        var options = {ItemId: item.amazon_id, ResponseGroup: 'Offers, ItemAttributes, Images'}

        //add Image to item
        prodAdv.call("ItemLookup", options, function(err, result) {
            var amazonItem = result.Items.Item;
            if (amazonItem) {
                item.imageUrl = amazonItem.LargeImage.URL;
                item.detailLink = amazonItem.DetailPageURL;
                item.name = amazonItem.ItemAttributes.Title;
                item.current_price = Number(amazonItem.OfferSummary.LowestNewPrice.Amount) / 100;
                user.items.push(item);

                user.save(function (err) {
                    if (err)
                        res.send(500, {error: err.message})
                    else
                        res.json(item);
                });
            }else
                res.send(500, {error: 'Product not found in amazon'});
        });
    });
};

var deleteItem = function(req, res){
    var user_id = req.params.user_id
    User.findOne({'username': user_id}, function(err, user){
        var item = user.items.id(req.params.item_id);
        if (!item)
            res.send(500, {error: 'Item not found'});
        else {
            item.remove();
            user.save(function (err) {
                if (err)
                    res.send(500, {error: err.message})
                else
                    res.send(200);
            });
        }
    })
};

var buyItem = function(req, res){
    var user_id = req.params.user_id
    User.findOne({'username': user_id}, function(err, user){
        var item = user.items.id(req.params.item_id);

        stripe.charges.create({
            amount: item.current_price  * 100,
            currency: 'cad',
            card: {
                number: user.card[0].number,
                exp_month: user.card[0].exp_month,
                exp_year: user.card[0].exp_year,
                cvc: user.card[0].cvc,
                name: user.card[0].name,
                address_line1: user.address,
                addres_city: user.city,
                address_zip: user.postal_code,
                address_country: user.country,
                address_state: user.province

            },
            receipt_email: user.email
        }, function(err, charge){
            if (err)
                res.send(500, {error: err.message});
            else
                res.json(charge);
        })
    });
};

module.exports = {
    getItems : getItems,
    addItem : addItem,
    deleteItem: deleteItem,
    buyItem: buyItem
}