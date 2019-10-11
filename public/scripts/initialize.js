function initializeApp() {
    sessionStorage.setItem('id', generateRandomString(8));
    sendOpenKeyToServer();
    getFileNames();
}

initializeApp();