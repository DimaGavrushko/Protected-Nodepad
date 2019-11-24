function getTextRequest(name) {
    fetchWrapper(`/getText?name=${name}`)
        .then(res => res.json())
        .then(([text, iv]) => {
            text = OFB(text, iv);
            const textArea = document.getElementById('encrypted-text');
            textArea.innerText = text;
        });
}

function sendKeyRequest(keysPair) {
    fetchWrapper('/auth/sendKey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            n: keysPair.n.value.toString(),
            e: keysPair.e.value.toString()
        })
    })
        .then(res => res.json())
        .then(sessionKeyArray => {
            keysPair = JSON.parse(getItemFromStorage('secret RSA key'));
            const sessionKey = decryptSessionKey(sessionKeyArray, keysPair.d, keysPair.n);
            sessionStorage.setItem('session key', sessionKey);
        });
}

async function loginRequest(email, password) {
    const user = await (await fetchWrapper('/auth/checkPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    })).json();

    if (!user.error) {
        const mainContainer = document.getElementById('main');
        mainContainer.innerHTML = getMainPage(user.email);
        sendOpenKeyToServer();
        getFilesRequest();
    }

}

async function tryAuthRequest() {
    return await fetchWrapper('/auth/tryAuth');
}

function getFilesRequest() {
    fetchWrapper('/getFiles')
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


function fetchWrapper(url, options = {}) {
    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {})
        },
        credentials: "same-origin"
    });
}