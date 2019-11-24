const router = require('express').Router();
const utils = require('../utils/utils');
const aes = require('../services/aes');
const storage = require('../utils/storage');

router.get('/getText', async (req, res) => {
    const text = await storage.decryptFile(req.query.name);
    const [content, iv] = aes.OFB(text, 'client');
    res.send(JSON.stringify([content, iv]));
});

router.get('/getFiles', async (req, res) => {
    res.send(await utils.readAllFileNames())
});

router.post('/sendKey', (req, res) => {
    res.send(utils.encryptSessionKey(utils.getSessionKey(), req.body.e, req.body.n));
});

module.exports = router;