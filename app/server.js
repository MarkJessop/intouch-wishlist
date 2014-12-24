var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var User = require('./models/user');
var cors = require('cors');
var bodyParser = require('body-parser');
var configDB = require('./config/database.js');
require('./config/cron'); //allows for CRON tasks

app.use(cors());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));
switch (process.env.NODE_ENV){
    case 'test':
        mongoose.connect(configDB.testUrl);
        break;
    default:
        mongoose.connect(configDB.url);
}

// routes ======================================================================
var item = require('./routes/item');
var card = require('./routes/card');
var user = require('./routes/user');

app.use('/user', item);
app.use('/user', card);
app.use('/user', user);
app.use('/', express.static(__dirname + '/public')); //serve up homepage

app.listen(port);   //launch

switch (process.env.NODE_ENV) {
    case 'test':
        console.log('Test Server listening on port ' + port);
        break;
    default:
        console.log('Server listening on port ' + port);
}
