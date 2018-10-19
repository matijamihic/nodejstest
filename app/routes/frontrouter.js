var express = require('express');
var session = require('express-session');
var router = express.Router();
var User = require('../models/user');
var Order = require('../models/order');
var Item = require('../models/item');
var path = require("path");
var app = express();
var router = express.Router(); // get an instance of the express Router


//-----------------------------------------------------------------------
//----------FRONTEND-----------------------------------------------------
//------------------------------------------------------------------------    
//GET route for index
router.get(['/', 'index.html'], function(req, res, next) {
  
  let itemsDataPr = function() {
  	return new Promise(function(resolve, reject) {
  	    Item.find(function (err, items) {
          if (err) return console.error(err);
     //         console.log(items);
              resolve(items);
        })
//  		resolve("Return items data");
  	});	
  };
  
  let userDataPr = function(items = null) {
  	return new Promise(function(resolve, reject) {
  	    User.findById(req.session.userId, function (err, user) {
          if (err) return console.error(err);
          
          if (user === null) {
            let userData = { 
              name: "",
              email: "",
              address: "",
              id: "",
              items: items
            }
            resolve(userData);
          } else {
            let userData = { 
              name: user.name,
              email: user.email,
              address: user.address,
              id: user._id,
              items: items
            }
            resolve(userData);
          }
          	  
      //  resolve(user);
        })
 // 		resolve("Return user data");
  	});	
  };
  
 // console.log(itemsDataPr());
  
  itemsDataPr().then(function(result){
  //  console.log(result);
  	return userDataPr(result);
  }).then(function(result){
    console.log(result);
    console.log("rendering...");
    return res.render('index.ejs', {userData:result});
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
        return res.redirect('/');
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
//console.log(req.body);
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
        let orderData = { 
                  order: req.body.order,
                  address: req.body.address,
                  name: req.body.name
                }
      return res.render('ordersuccess.ejs', {orderData: orderData});
  
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