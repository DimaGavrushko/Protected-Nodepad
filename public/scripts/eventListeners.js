function generateNewRSAKey() {
    sendOpenKeyToServer();
}

function getText() {
    const select = document.getElementById('file-names');
    const name = select.options[select.selectedIndex].value;
    fetch(`/getText?name=${name}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Client-id': sessionStorage.getItem('id')
        }
    })
        .then(res => res.json())
        .then(([text, iv]) => {
            text = OFB(text, iv);
            const textArea = document.getElementById('encrypted-text');
            textArea.innerText = text;
        })
}