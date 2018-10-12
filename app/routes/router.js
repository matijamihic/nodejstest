var express = require('express');
var session = require('express-session');
var router = express.Router();
var User = require('../models/user');
var Order = require('../models/order');
var Item = require('../models/item');
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
// ----------------------------------------------------
// ------------USERS API----------------------------------------
router.route('/users')

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
router.route('/users/:user_id')

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
    
// ----------------------------------------------------
// -------------ORDRS API---------------------------------------
 
router.route('/orders') 
  // get all the orders (accessed at GET https://nodebeer-krilas.c9users.io/api/orders)
  .get(function(req, res) {
      Order.find(function(err, orders) {
          if (err)
              res.send(err);

          res.json(orders);
      });
  });
  
// on routes that end in /orders/:order_id
router.route('/orders/:order_id')
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
    
// ----------------------------------------------------
// -------------ITEMS API------------------------------

router.route('/items') 
  // get all the items (accessed at GET https://nodebeer-krilas.c9users.io/api/items)
  .get(function(req, res) {
      Item.find(function(err, items) {
          if (err)
              res.send(err);

          res.json(items);
      });
  })
  
  // create an item (accessed at POST https://nodebeer-krilas.c9users.io/api/items)
  .post(function(req, res) {

      var item = new Item();      // create a new instance of the User model
      item.name = req.body.name;  // set the item name (comes from the request)
      item.price = req.body.price;  //set items price

      // save the item and check for errors
      item.save(function(err) {
          if (err)
              res.send(err);

          res.json({ message: 'Item created!' });
      });

  });

module.exports = router;