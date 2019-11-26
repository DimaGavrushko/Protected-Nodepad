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

function buf2hex(hashBuffer) {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
    let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    let bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

async function sha256(message, iterations = 1) {
    let msgUint8 = new TextEncoder().encode(message);
    for (let i = 0; i < iterations; i++) {
        msgUint8 = await crypto.subtle.digest('SHA-256', msgUint8);
    }

    return buf2hex(msgUint8);
}
