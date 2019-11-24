const dotenv = require('dotenv');

module.exports = () => {
    global.userMap = [];
    dotenv.config();
};