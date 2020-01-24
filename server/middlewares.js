const jwt = require('jsonwebtoken');

const useUserSessionKey = (req, res, next) => {
  const id = req.cookies.token;
  let usr;
  if ((usr = userMap.find(u => u.id === id))) {
    process.env.SESSION_KEY = usr.key;
  }
  next();
};

const withAuth = function(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

module.exports = {
  useUserSessionKey,
  withAuth
};
