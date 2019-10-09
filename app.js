const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const utils = require('./server/utils/utils');
const aes = require('./server/service/aes');

app.use('', express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/getText', async (req, res) => {
    const [content, iv] = aes.OFB(await utils.readFile(req.query.name));
    res.send(JSON.stringify([content, iv]))
});

app.get('/getFiles', async (req, res) => {
    res.send(await utils.readAllFileNames())
});

app.post('/sendKey', (req, res) => {
    utils.createSessionKey();
    utils.encryptRSA(utils.getSessionKey(), req.body.e, req.body.n);
    res.send(utils.encryptRSA(utils.getSessionKey(), req.body.e, req.body.n));
});

app.listen(port, () => console.log('Server is starting...'));