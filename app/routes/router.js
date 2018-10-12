var express = require('express');
var session = require('express-session');
var router = express.Router();
var User = require('../models/user');
var Order = require('../models/order');
var path = require("path");
var app = express();
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

//-----------------------------------------------------------------------
//----------API-----------------------------------------------------
//------------------------------------------------------------------------  

// test route to make sure everything is working (accessed at GET https://nodebeer-krilas.c9users.io/api/)
router.get('/api', function(req, res) {
    res.json({ message: 'Welcome to the api!' });   
});

router.route('/api/users')

    // create a user (accessed at POST https://nodebeer-krilas.c9users.io/api/users)
    .post(function(req, res) {

        var user = new User();      // create a new instance of the User model
        user.name = req.body.name;  // set the users name (comes from the request)
        user.email = req.body.email;
        user.password = req.body.password;
        user.address = req.body.address;

        // save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });

    })
    
    // get all the users (accessed at GET https://nodebeer-krilas.c9users.io/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });
    
// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/api/users/:user_id')

    // get the user with that id (accessed at GET https://nodebeer-krilas.c9users.io/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
                
            res.json(user);
        });
    })
    
    
    // update the user with this id (accessed at PUT https://nodebeer-krilas.c9users.io/api/users/:user_id)
    .put(function(req, res) {

        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name;  // update the users info

            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

        });
    })
    
    // delete the user with this id (accessed at DELETE https://nodebeer-krilas.c9users.io/api/users/:user_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
    
//Orders API    
router.route('/api/orders') 
  // get all the orders (accessed at GET https://nodebeer-krilas.c9users.io/api/orders)
  .get(function(req, res) {
      Order.find(function(err, orders) {
          if (err)
              res.send(err);

          res.json(orders);
      });
  });
  
// on routes that end in /orders/:order_id
// ----------------------------------------------------
router.route('/api/orders/:order_id')
    // delete the order with this id (accessed at DELETE https://nodebeer-krilas.c9users.io/api/orders/:user_id)
    .delete(function(req, res) {
        Order.remove({
            _id: req.params.order_id
        }, function(err, order) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


//-----------------------------------------------------------------------
//----------FRONTEND-----------------------------------------------------
//------------------------------------------------------------------------    
//GET route for index
router.get(['/', 'index.html'], function(req, res, next) {
  var user = User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          let userData = { 
            name: "",
            email: "",
            address: "",
            id: ""
          }
          return res.render('index.ejs', {userData:userData});
        } else {
          let userData = { 
            name: user.name,
            email: user.email,
            address: user.address,
            id: user._id
          }
          return res.render('index.ejs', {userData:userData});
        }
      }
    });
});
 
//POST route for updating user data (registration and login)
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.address) {

    var userData = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      address: req.body.address,
    }
    
    User.create(userData, function (error, user) {
    //  console.log(req.session);
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
   //   console.log(user);
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
          let userData = { 
            name: user.name,
            id: user._id,
            address: user.address
          }
        return res.render('index.ejs', {userData:userData});
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

//POST route for making an order
router.post('/order', function (req, res, next) {
console.log(req.body);
  if (req.body.address && req.body.name && req.body.order) {

    var orderData = {
      address: req.body.address,
      name: req.body.name,
      order: req.body.order,
      userId: req.body.userId
    }
    
    Order.create(orderData, function (error, order) {
      if (error) {
        return next(error);
      } else {
        return res.redirect('/');
      }
    });

  } else {
    var err = new Error('All fields required.(order)');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('<a href="/">Not authorized! Go back!</a>');
          err.status = 400;
          return next(err);
        } else {
              console.log(user);
              let userData = { 
                                name: user.name,
                                email: user.email,
                                address: user.address,
                                id: user._id
                              }
          return res.render('profile.ejs', {user: userData});
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;