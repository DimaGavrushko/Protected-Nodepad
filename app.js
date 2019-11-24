const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const { useUserSessionKey } = require('./server/middlewares');
const router = require('./server/routes');
const initialize = require('./server/initialize');

initialize();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(useUserSessionKey);
app.use('/', router);

app.listen(port, () => console.log('Server is starting...'));