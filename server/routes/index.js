const router = require('express').Router();
const main = require('./main');

router.use('/', main);

module.exports = router;