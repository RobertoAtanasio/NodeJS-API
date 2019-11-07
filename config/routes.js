// api -> pasta; user -> arquivo.js; save -> método dentro de user
// Acesso disponível devido ao consign em index.js

module.exports = app => {
    app.route('/users')
        .post(app.api.user.save)
};