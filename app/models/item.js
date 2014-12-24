var mongoose = require('mongoose');
var prodAdv = require('../config/amazon');

var itemSchema = new mongoose.Schema({
    price: Number,
    current_price: Number,
    amazon_id: String,
    name: String,
    imageUrl: String,
    detailLink: String
})

var Item = mongoose.model('Item', itemSchema);

var updateItem = function(item){
    var options = {ItemId: item.amazon_id, ResponseGroup: 'Offers, ItemAttributes, Images'}
    //find product
    prodAdv.call("ItemLookup", options, function(err, result) {
        var amazonItem = result.Items.Item;
        item.current_price = Number(amazonItem.OfferSummary.LowestNewPrice.Amount) / 100;
        item.save(function(err){
            if (err)
                console.log(err);
        });
    });
}

module.exports = {
    itemSchema: itemSchema,
    Item: Item,
    updateItem: updateItem
};