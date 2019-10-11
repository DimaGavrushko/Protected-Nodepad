const bigInt = require("big-integer");
const fs = require('fs');
const util = require('util');


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

function getSessionKey() {
    //return fs.readFileSync('key.txt', 'utf8');
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

module.exports = {
    getSessionKey,
    generateRandomString,
    createSessionKey,
    encryptSessionKey,
    readAllFileNames,
    readFile
};