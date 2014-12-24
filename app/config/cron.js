var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var User = require('../models/user');
var updateItem = require('../models/item').updateItem;

//Every 2 hours update the prices
new CronJob('0 0 */2 * * *', function(){
    console.log('Updating prices');
    User.find({}, function(err, users){
        for (var x = 0; x < users.length; x++){
            for (var i = 0; i < users[x].items.length; i++) {
                updateItem(users[x].items[i]);
            }
        }
    });
}, null, true);