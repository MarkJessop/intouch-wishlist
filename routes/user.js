var router = require('express').Router();
var usersController = require('../controllers/user');


router.route('/:user_id')
    .get(usersController.getUser)
    .put(usersController.updateUser);

module.exports = router;