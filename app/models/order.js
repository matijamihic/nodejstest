var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
  },
    order: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: false,
  }
});

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;