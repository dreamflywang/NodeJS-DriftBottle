var express = require('express');
var bodyParser = require('body-parser');
var redis = require('./models/redis.js');


var routes = require('./routes/index');


var app = express();
app.use(bodyParser());
app.use('/', routes);

app.listen(3000);

