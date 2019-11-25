function generateRSAKeys() {
    return RSA.generate(128);
}

function setRSAKeyInStorage(keysPair) {
    sessionStorage.setItem('secret RSA key',
        JSON.stringify({n: keysPair.n.value.toString(), d: keysPair.d.value.toString()}));
}

function getItemFromStorage(name) {
    return sessionStorage.getItem(name);
}

function sendOpenKeyToServer() {
    let keysPair = generateRSAKeys();
    setRSAKeyInStorage(keysPair);
    getSessionKeyRequest(keysPair);
}

function decryptSessionKey(keyArray, d, n) {
    let res = '';
    keyArray.forEach(c => {
        res += String.fromCharCode(RSA.decrypt(c, d, n).value.toString());
    });
    return res;
}

function generateRandomString(length) {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}