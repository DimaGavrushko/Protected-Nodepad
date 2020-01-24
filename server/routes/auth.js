const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { withAuth } = require('../middlewares');
const utils = require('../utils/utils');
const sendToken = require('../services/email');
const userService = require('../services/user');

router.post('/getA', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    res.status(200).json(user.__a);
  } catch (err) {
    res.status(401).json({
      error: err.message
    });
  }
});

router.post('/checkPassword', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    user.isCorrectPassword(password, async (err, same) => {
      if (err) {
        res.status(500).json({
          error: 'Internal error please try again'
        });
      } else if (!same) {
        res.status(401).json({
          error: 'Incorrect password'
        });
      } else {
        await sendToken(email);
        res.status(200).json({ email });
      }
    });
  } catch (err) {
    res.status(401).json({
      error: err.message
    });
  }
});

router.post('/checkToken', async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    bcrypt.compare(token, user.token, async (err, same) => {
      if (err) {
        res.status(500).json({
          error: 'Internal error please try again'
        });
      } else if (!same) {
        res.status(401).json({
          error: 'Incorrect token'
        });
      } else {
        const payload = { email, date: Date.now() };
        await User.updateOne({ email }, { token: null, __a: user.__a + 1 });
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        utils.createSessionKeyForUser(token);
        res
          .status(200)
          .cookie('token', token, { httpOnly: true })
          .json({ email });
      }
    });
  } catch (err) {
    res.status(401).json({
      error: err.message
    });
  }
});

router.get('/tryAuth', withAuth, async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.email);
    utils.createSessionKeyForUser(req.cookies.token);
    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({
      error: err.message
    });
  }
});

router.get('/logout', withAuth, async (req, res) => {
  res
    .status(200)
    .cookie('token', null, { httpOnly: true })
    .json({ email: req.email });
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password, __a: 1 });

  user.save(err => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send('Success');
    }
  });
});

router.post('/getSessionKey', withAuth, (req, res) => {
  res.send(
    utils.encryptSessionKey(utils.getSessionKey(), req.body.e, req.body.n)
  );
});

module.exports = router;
