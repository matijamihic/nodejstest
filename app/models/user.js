var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  email: {
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
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;