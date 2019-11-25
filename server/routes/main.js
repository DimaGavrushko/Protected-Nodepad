const router = require('express').Router();
const utils = require('../utils/utils');
const aes = require('../services/aes');
const storage = require('../services/storage');
const { withAuth } = require('../middlewares');

router.get('/getText', withAuth, async (req, res) => {
    const text = await storage.decryptFile(req.query.name);
    const [content, iv] = aes.OFB(text, 'client');
    res.send(JSON.stringify([content, iv]));
});

router.get('/getFiles', withAuth, async (req, res) => {
    res.send(await utils.readAllFileNames())
});


module.exports = router;