const utils = require('./utils');
const util = require('util');
const fs = require('fs');
const aes = require('../services/aes');

const iv = '*G-KaPdRgUkXp2s5';

async function decryptFile(fileName) {
    return aes.OFB(await utils.readFile(fileName), 'storage', iv)[0];
}

async function encryptFile(fileName) {
    const [content] = aes.OFB(await utils.readFile(fileName), 'storage', iv);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`server/files/${fileName}`, content, 'utf8');
}

module.exports = {
    decryptFile
};