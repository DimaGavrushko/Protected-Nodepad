async function initializeApp() {
    const userResponse = await tryAuthRequest();
    const mainContainer = document.getElementById('main');
    if (userResponse.status === 200) {
        const user = await userResponse.json();
        mainContainer.innerHTML = getMainPage(user.email);
        sendOpenKeyToServer();
        getFilesRequest();
    } else {
        mainContainer.innerHTML = getLoginPage();
    }
}

initializeApp();
