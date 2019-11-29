function getMainPage(name) {
    return `
     <div class="header">
        <h6>Привет, ${name}</h6>
        <button type="button" class="btn btn-primary" onclick="logout()">Выйти</button>
     </div>
     <button type="button" class="btn-sm btn-primary margin-bottom" onclick="generateNewRSAKey()">Сгенерировать новый ключ</button>

    <div class="form-group">
        <select class="custom-select" id="file-names"></select>
    </div>

    <button type="button" class="btn btn-primary" onclick="getText()">Получить текст</button>

    <div class="mb-3 margin-top">
        <label for="encrypted-text">Text</label>
        <textarea class="form-control" id="encrypted-text" disabled></textarea>
    </div>`;
}