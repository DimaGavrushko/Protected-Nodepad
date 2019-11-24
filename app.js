const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { useUserSessionKey } = require('./server/middlewares');
const router = require('./server/routes');
const initialize = require('./server/initialize');

initialize();

mongoose.connect(`mongodb://localhost:27017/protectedNotepad`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Successfully connected to database"));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(useUserSessionKey);
app.use('/', router);

app.listen(3000, () => console.log('Server is starting...'));