import { getFilesRequest, tryAuthRequest } from './requests.js';
import { sendOpenKeyToServer } from './utils.js';
import getMainPage from '../pages/main.js';
import getLoginPage from '../pages/login.js';

(async function() {
  async function initializeApp() {
    const userResponse = await tryAuthRequest();
    if (userResponse.status === 200) {
      const user = await userResponse.json();
      getMainPage(user.email);
      sendOpenKeyToServer();
      getFilesRequest();
    } else {
      getLoginPage();
    }
  }

  await initializeApp();
})();
