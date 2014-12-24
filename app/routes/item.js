var router = require('express').Router();
var itemsController = require('../controllers/item')



router.route('/:user_id/items')
    .get(itemsController.getItems)
    .post(itemsController.addItem);

router.route('/:user_id/items/:item_id')
    .delete(itemsController.deleteItem);

router.route('/:user_id/items/:item_id/buy')
    .get(itemsController.buyItem);

module.exports = router;