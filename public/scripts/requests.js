function getTextRequest(name) {
    fetchWrapper(`/getText?name=${name}`)
        .then(res => res.json())
        .then(([text, iv]) => {
            text = OFB(text, iv);
            const textArea = document.getElementById('encrypted-text');
            textArea.innerText = text;
        });
}

function getSessionKeyRequest(keysPair) {
    fetchWrapper('/auth/getSessionKey', {
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

async function checkPasswordRequest(email, password) {
    const a = await (await fetchWrapper('/auth/getA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email

        })
    })).json();

    const pass = await sha256(password, 1000 - a);

    const res = await (await fetchWrapper('/auth/checkPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password: pass
        })
    })).json();

    if (!res.error) {
        const mainContainer = document.getElementById('main');
        mainContainer.innerHTML = getTokenPage(res.email);
    }
}

async function checkTokenRequest(email, token) {
    const res = await (await fetchWrapper('/auth/checkToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            token
        })
    })).json();

    if (!res.error) {
        const mainContainer = document.getElementById('main');
        mainContainer.innerHTML = getMainPage(res.email);
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
