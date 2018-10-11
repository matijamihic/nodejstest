var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
  order: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: false,
  }
});

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;