const router = require('express').Router();
const main = require('./main');
const auth = require('./auth');

router.use('/', main);
router.use('/auth', auth);

module.exports = router;