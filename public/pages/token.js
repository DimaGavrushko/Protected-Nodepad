import { addListenerToButton } from '../scripts/utils.js';
import { getTokenFormSubmit } from '../scripts/eventListeners.js';

export default function getTokenPage(email) {
  const mainContainer = document.getElementById('main');
  mainContainer.innerHTML = `<div class="login-container">
        <div class="form-group">
                <label for="inputToken">Enter token sent to <b>${email}</b></label>
                <input type="text" class="form-control" id="inputToken" placeholder="Enter token">
            </div>
            <button type="submit" class="btn btn-primary" id="getTokenFormSubmit">Войти</button>
    </div>`;

  addListenerToButton('getTokenFormSubmit', async () => {
    await getTokenFormSubmit(email);
  });
}
