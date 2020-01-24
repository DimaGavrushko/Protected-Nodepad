import {
  getTextRequest,
  checkPasswordRequest,
  checkTokenRequest,
  logoutRequest
} from './requests.js';
import { sendOpenKeyToServer } from './utils.js';

export function generateNewRSAKey() {
  sendOpenKeyToServer();
}

export function getText() {
  const select = document.getElementById('file-names');
  const name = select.options[select.selectedIndex].value;
  getTextRequest(name);
}

export async function getLoginFormSubmit() {
  const email = document.getElementById('inputEmail').value;
  const password = document.getElementById('inputPassword').value;
  await checkPasswordRequest(email, password);
}

export async function getTokenFormSubmit(email) {
  const token = document.getElementById('inputToken').value;
  await checkTokenRequest(email, token);
}

export async function logout() {
  await logoutRequest();
}
