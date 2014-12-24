var router = require('express').Router();
var cardController = require('../controllers/card')


router.route('/:user_id/card').post(cardController.addCard);

module.exports = router;