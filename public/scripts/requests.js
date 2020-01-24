import {
  decryptSessionKey,
  getItemFromStorage,
  sha256,
  sendOpenKeyToServer
} from "./utils.js";
import getLoginPage from "../pages/login.js";
import getTokenPage from "../pages/token.js";
import getMainPage from "../pages/main.js";
import OFB from "./aes.js";

export function getTextRequest(name) {
  fetchWrapper(`/getText?name=${name}`)
    .then(res => res.json())
    .then(([text, iv]) => {
      text = OFB(text, iv);
      const textArea = document.getElementById('encrypted-text');
      textArea.innerText = text;
    });
}

export function getSessionKeyRequest(keysPair) {
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
      const sessionKey = decryptSessionKey(
        sessionKeyArray,
        keysPair.d,
        keysPair.n
      );
      sessionStorage.setItem('session key', sessionKey);
    });
}

export async function checkPasswordRequest(email, password) {
  const a = await (await fetchWrapper('/auth/getA', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email
    })
  })).json();

  if (!a.error) {
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
      getTokenPage(res.email);
    }
  }
}

export async function logoutRequest() {
  const res = await (await fetchWrapper('/auth/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })).json();

  if (!res.error) {
    getLoginPage();
  }
}

export async function checkTokenRequest(email, token) {
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
    getMainPage(res.email);
    sendOpenKeyToServer();
    getFilesRequest();
  }
}

export async function tryAuthRequest() {
  return await fetchWrapper('/auth/tryAuth');
}

export function getFilesRequest() {
  fetchWrapper('/getFiles')
    .then(res => res.json())
    .then(fileNames => {
      const select = document.getElementById('file-names');
      fileNames.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.innerHTML = name;
        select.appendChild(opt);
      });
    });
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
