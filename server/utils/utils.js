const bigInt = require("big-integer");
const fs = require('fs');
const util = require('util');
const shajs = require('sha.js');

function generateRandomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function createSessionKey() {
    process.env.SESSION_KEY = generateRandomString(16);
}

function createSessionKeyForUser(token) {
    createSessionKey();
    userMap.push({
        id: token,
        key: process.env.SESSION_KEY
    });
}

function getSessionKey() {
    return process.env.SESSION_KEY;
}

function encryptSessionKey(m, e, n) {
    let resultKey = [];
    for (let i = 0; i < m.length; i++) {
        resultKey.push(bigInt(m.charCodeAt(i)).modPow(e, n).value.toString());
    }
    return JSON.stringify(resultKey);
}

async function readAllFileNames() {
    const readdir = util.promisify(fs.readdir);
    return await readdir('server/files');
}

async function readFile(name) {
    const readFile = util.promisify(fs.readFile);
    return await readFile(`server/files/${name}`, 'utf8');
}

function sha256(string, iterations = 1, stringType = 'ascii' ) {
    let buff = Buffer.from(string, stringType);
    for (let i = 0; i < iterations; i++) {
        buff = shajs('sha256').update(buff).digest()
    }

    return buff.toString('hex');
}

module.exports = {
    getSessionKey,
    generateRandomString,
    createSessionKey,
    encryptSessionKey,
    readAllFileNames,
    readFile,
    sha256,
    createSessionKeyForUser
};
