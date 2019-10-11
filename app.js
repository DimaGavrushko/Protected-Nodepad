const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const utils = require('./server/utils/utils');
const aes = require('./server/services/aes');

global.userMap = [];

app.use('', express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use('', (req, res, next) => {
    const id = req.get('Client-id');
    let usr;
    if (usr = userMap.find(u => u.id === id)) {
        process.env.SESSION_KEY = usr.key;
    } else {
        utils.createSessionKey();
        userMap.push({
            id: req.get('Client-id'),
            key: process.env.SESSION_KEY
        });
    }

    next();
});

app.get('/getText', async (req, res) => {
    const [content, iv] = aes.OFB(await utils.readFile(req.query.name));
    res.send(JSON.stringify([content, iv]))
});

app.get('/getFiles', async (req, res) => {
    res.send(await utils.readAllFileNames())
});

app.post('/sendKey', (req, res) => {
    res.send(utils.encryptSessionKey(utils.getSessionKey(), req.body.e, req.body.n));
});

app.listen(port, () => console.log('Server is starting...'));