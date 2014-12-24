var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');

var cors = require('cors');
app.use(cors());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));

var configDB = require('./config/database.js');
switch (process.env.NODE_ENV){
    case 'test':
        mongoose.connect(configDB.testUrl);
        break;
    default:
        mongoose.connect(configDB.url);
}

require('./config/cron');



// routes ======================================================================
var item = require('./routes/item');
var card = require('./routes/card');
var user = require('./routes/user');

app.use('/user', item);
app.use('/user', card);
app.use('/user', user);
app.use('/', express.static(__dirname + '/public')); //serve up homepage

// launch ======================================================================
app.listen(port);
switch (process.env.NODE_ENV) {
    case 'test':
        console.log('Test Server listening on port ' + port);
        break;
    default:
        console.log('Server listening on port ' + port);
}
