import { addListenerToButton } from "../scripts/utils.js";
import { getLoginFormSubmit } from "../scripts/eventListeners.js";

export default function getLoginPage() {
  const mainContainer = document.getElementById('main');
  mainContainer.innerHTML = `<div class="login-container">
        <div class="form-group">
                <label for="inputEmail">Email address</label>
                <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp"
                       placeholder="Enter email">
            </div>
            <div class="form-group">
                <label for="inputPassword">Password</label>
                <input type="password" class="form-control" id="inputPassword" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary" id="submitPasswordButton">Войти</button>
    </div>`;

  addListenerToButton('submitPasswordButton', getLoginFormSubmit);
}
