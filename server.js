// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


app.set("view engine", "ejs")
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//use sessions for tracking logins
app.use(session({
  cookie: {
    path    : '/',
    httpOnly: false,
    maxAge  : 24*60*60*1000
  },
  secret: '1234567890QWERT'
}));


// call and connecto to database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://krilas-nodebeer-6431409:27017'); // connect to our database
var db = mongoose.connection;
var User     = require('./app/models/user');

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("we're connected!");
});

var port = process.env.PORT || 8080;        // set our port

// include routes
var routes = require('./app/routes/router');
var frontRoutes = require('./app/routes/frontrouter');

app.use('/api', routes);
app.use('/', frontRoutes);
app.use(express.static('templateLogReg'))


// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);