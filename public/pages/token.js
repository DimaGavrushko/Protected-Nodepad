function getTokenPage(email) {
    return `<div class="login-container">
        <div class="form-group">
                <label for="inputToken">Enter token sent to <b>${email}</b></label>
                <input type="text" class="form-control" id="inputToken" placeholder="Enter token">
            </div>
            <button type="submit" class="btn btn-primary" onclick="getTokenFormSubmit('${email}')">Войти</button>
    </div>`;
}