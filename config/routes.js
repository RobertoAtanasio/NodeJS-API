// api -> pasta; user -> arquivo.js; save -> método dentro de user
// Acesso disponível devido ao consign em index.js

module.exports = app => {
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get);

    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getById);
};