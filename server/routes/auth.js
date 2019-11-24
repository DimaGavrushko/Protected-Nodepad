const router = require('express').Router();
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { withAuth } = require('../middlewares');
const utils = require('../utils/utils');

router.post('/checkPassword', function(req, res) {
    const { email, password } = req.body;

    User.findOne({ email }, function(err, user) {
        if (err) {
            console.error(err);
            res.status(500)
                .json({
                    error: 'Internal error please try again'
                });
        } else if (!user) {
            res.status(401)
                .json({
                    error: 'Incorrect email or password'
                });
        } else {
            user.isCorrectPassword(password, function(err, same) {
                if (err) {
                    res.status(500)
                        .json({
                            error: 'Internal error please try again'
                        });
                } else if (!same) {
                    res.status(401)
                        .json({
                            error: 'Incorrect email or password'
                        });
                } else {
                    const payload = { email };
                    const token = jwt.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: '1h'
                    });
                    utils.createSessionKey();
                    userMap.push({
                        id: token,
                        key: process.env.SESSION_KEY
                    });
                    res.status(200).cookie('token', token, { httpOnly: true }).json(user);
                }
            });
        }
    });
});

router.get('/tryAuth', withAuth, function(req, res) {
    User.findOne({ email: req.email }, function (err, user) {
        if (err) {
            res.status(500)
                .json({
                    error: 'Internal error please try again'
                });
        }
        utils.createSessionKey();
        userMap.push({
            id: req.cookies.token,
            key: process.env.SESSION_KEY
        });
        res.status(200).json(user)
    });
});

router.post('/register', function(req, res) {
    const { email, password } = req.body;
    const user = new User({ email, password });

    // TODO: create user service
    user.save(function(err) {
        if (err) {
            res.status(500)
                .send(err.message);
        } else {
            res.status(200).send("Success");
        }
    });
});

router.post('/sendKey', (req, res) => {
    res.send(utils.encryptSessionKey(utils.getSessionKey(), req.body.e, req.body.n));
});

module.exports = router;