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

    fetch('/sendKey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            n: keysPair.n.value.toString(),
            e: keysPair.e.value.toString()
        })
    })
        .then(res => res.json())
        .then(sessionKeyArray => {
            keysPair = JSON.parse(getItemFromStorage('secret RSA key'));
            const sessionKey = decryptKey(sessionKeyArray, keysPair.d, keysPair.n);
            sessionStorage.setItem('session key', sessionKey);
        })
}

function decryptKey(keyArray, d, n) {
    let res = '';
    keyArray.forEach(c => {
        res += String.fromCharCode(RSA.decrypt(c, d, n).value.toString());
    });
    return res;
}

function getFileNames() {
    fetch('/getFiles')
        .then(res => res.json())
        .then(fileNames => {
            const select = document.getElementById('file-names');
            fileNames.forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.innerHTML = name;
                select.appendChild(opt);
            })
        })
}