var User = require('../models/user');

var getUser = function(req, res){
    var user_id = req.params.user_id;

    User.findOne({'username': user_id}, function(err, user){
        if (err)
            res.send(500, {error: err.message});
        else
            res.json(user);
    });
};

var updateUser = function(req, res){
    var user_id = req.params.user_id;
    User.findOne({'username': user_id}, function(err, user){
        if (user){
            var newUser = req.body;
            user.name = newUser["user[name]"];
            user.email = newUser["user[email]"];
            user.address = newUser["user[address]"];
            user.city = newUser["user[city]"];
            user.province = newUser["user[province]"];
            user.country = newUser["user[country]"];
            user.postal_code = newUser["user[postal_code]"];
            user.save(function(err){
                if (err)
                    res.send(500, {error: err.message})
                else
                    res.status(200).json(user);
            })
        }else
            res.send(500, {error: 'User not found'});
    })
};

module.exports = {
    getUser : getUser,
    updateUser : updateUser
}