const utils = require('./utils/utils');


const useUserSessionKey = (req, res, next) => {
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
};

module.exports = {
    useUserSessionKey
};