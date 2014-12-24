var mongoose = require('mongoose');
var config = require('./config/database');
var User = require('./models/user');


mongoose.connect(config.url);
User.create({
    name: 'Test User',
    email: 'test@test.com',
    address: '123 fake st',
    city: "Ottawa",
    province: 'Ontario',
    country: 'Canada',
    postal_code: 'A1B 2C3',
    username: 'markj',
    card: [{
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2014,
        cvc : 113,
        name: 'Test User'
    }]
});
console.log('Database initialized');
mongoose.disconnect();