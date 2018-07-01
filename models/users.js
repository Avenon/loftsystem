const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },

  firstName: {
    type: String,
    required: true
  },

  surName: {
    type: String,
    required: true
  },

  middleName: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  hash: String,
  salt: String
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto
    .randomBytes(16)
    .toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 512, 'sha512')
    .toString('hex');
};

userSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 512, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
  var expire = new Date();
  expire.setDate(expire.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    firstName: this.firstName,
    surName: this.surName,
    middleName: this.middleName,
    exp: parseInt(expire.getTime() / 1000)
  }, process.env.JWT_SECRET);
};

mongoose.model('users', userSchema);
