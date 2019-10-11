function generateNewRSAKey() {
    sendOpenKeyToServer();
}

function getText() {
    const select = document.getElementById('file-names');
    const name = select.options[select.selectedIndex].value;
    getTextRequest(name);
}