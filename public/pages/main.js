import { addListenerToButton } from '../scripts/utils.js';
import {
  logout,
  generateNewRSAKey,
  getText
} from '../scripts/eventListeners.js';

export default function getMainPage(name) {
  const mainContainer = document.getElementById('main');
  mainContainer.innerHTML = `<div class="header">
        <h6>Привет, ${name}</h6>
        <button type="button" class="btn btn-primary" id="logoutButton">Выйти</button>
     </div>
     <button type="button" class="btn-sm btn-primary margin-bottom" id="generateNewRSAKey">Сгенерировать новый ключ</button>

    <div class="form-group">
        <select class="custom-select" id="file-names"></select>
    </div>

    <button type="button" class="btn btn-primary" id="getText">Получить текст</button>

    <div class="mb-3 margin-top">
        <label for="encrypted-text">Text</label>
        <textarea class="form-control" id="encrypted-text" disabled></textarea>
    </div>`;

  addListenerToButton('logoutButton', logout);
  addListenerToButton('generateNewRSAKey', generateNewRSAKey);
  addListenerToButton('getText', getText);
}
