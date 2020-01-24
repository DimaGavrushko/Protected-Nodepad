const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const utils = require('../utils/utils');

const salt = bcrypt.genSaltSync(10);

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true },
  __a: { type: Number },
  token: { type: String }
});

UserSchema.pre('save', function(next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.password, salt, (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.isCorrectPassword = function(password, callback) {
  const pass = utils.sha256(password, this.__a, 'hex');
  bcrypt.compare(pass, this.password, (err, same) => {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};

module.exports = mongoose.model('User', UserSchema);
