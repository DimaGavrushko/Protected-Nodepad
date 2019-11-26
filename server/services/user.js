const User = require("../models/user");


function getUserByEmail(email) {
  return User.findOne({email})
    .then(user => {
      if (!user) {
        throw new Error("Incorrect email");
      } else {
        return user;
      }
    })
    .catch(err => {
        throw err;
    })
}

module.exports = {
  getUserByEmail
};
