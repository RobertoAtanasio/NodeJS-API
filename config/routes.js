const admin = require ('./admin')

// api -> pasta; user -> arquivo.js; save -> método dentro de user
// Acesso disponível devido ao consign em index.js

module.exports = app => {

    // Serão as 3 únicas URLS que não estarão sejeitas às validaçoes do tpken.
    app.post('/signup', app.api.user.save);
    app.post('/signin', app.api.auth.signin);
    app.post('/validateTpken', app.api.auth.validateTpken);

    // Todas as URLs abaixo estarão sujeitas às validações do token.
    app.route('/users')
        .all(app.config.passport.autheticate())
        .post(admin(app.api.user.save))
        .get(admin(app.api.user.get));

    app.route('/users/:id')
        .all(app.config.passport.autheticate())
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.getById))
        .delete(admin(app.api.user.remove));

    app.route('/categories')
        .all(app.config.passport.autheticate())
        .get(admin(app.api.category.get))
        .post(admin(app.api.category.save));

    // Cuidado com a ordem! Tem que vir antes de '/categories/:id' senão o express vai interpretar
    // qua a palavre tree é o parâmetro :id
    app.route('/categories/tree')
        .all(app.config.passport.autheticate())
        .get(app.api.category.getTree);

    app.route('/categories/:id')
        .all(app.config.passport.autheticate())
        .put(admin(app.api.category.save))
        .get(app.api.category.getById)
        .delete(admin(app.api.category.remove));

    app.route('/articles')
        .all(app.config.passport.autheticate())
        .post(admin(app.api.article.save))
        .get(admin(app.api.article.get));

    app.route('/articles/:id')
        .all(app.config.passport.autheticate())
        .get(app.api.article.getById)
        .put(admin(app.api.article.save))
        .delete(admin(app.api.article.remove));

    app.route('/categories/:id/articles')
        .all(app.config.passport.autheticate())
        .get(app.api.article.getByCategory);

    app.route('/stats')
        .all(app.config.passport.autheticate())
        .get(app.api.stat.get)
};