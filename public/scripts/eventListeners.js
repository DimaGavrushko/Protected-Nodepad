function generateNewRSAKey() {
    sendOpenKeyToServer();
}

function getText() {
    const select = document.getElementById('file-names');
    const name = select.options[select.selectedIndex].value;
    getTextRequest(name);
}

function getLoginFormSubmit() {
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    loginRequest(email, password);
}