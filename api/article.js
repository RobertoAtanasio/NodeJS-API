const queries = require('./queries')

module.exports = app => {
    const { existsOrError } = app.api.validation;

    const save = (req, res) => {
        const article = { ...req.body };
        if (req.params.id) article.id = req.params.id;
        try {
            existsOrError(article.name, 'Nome não informado.');
            existsOrError(article.description, 'Descrição não informada.');
            existsOrError(article.categoryId, 'Categoria não informada.');
            existsOrError(article.userId, 'Autor não informado.');
            existsOrError(article.content, 'Conteúdo não informado.');
        } catch (error) {
            return res.status(400).send(error);
        }

        if (article.id) {
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then ( () => res.status(204).send() )
                .catch ( erro => res.status(500).send(erro));
        } else {
            app.db('articles')
                .insert(article)
                .then( () => res.status(201).send())
                .catch ( erro => res.status(500).send(erro));
        }
    };

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código não informado.');
            const rowsDeleted = await app.db('articles')
                .where ({ id: req.params.id }).del()
                .catch ( erro => res.status(500).send(erro));
            
            try {
                existsOrError(rowsDeleted, 'Artigo não encontrado.');
            } catch (error) {
                return res.status(400).send(error);
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    const limit = 4;
    const get = async (req, res) => {
        let page = req.query.page || 1;
        page = page <= 0 ? 1 : page;
        const result = await app.db('articles').count('id').first();
        const count = parseInt(result.count);

        app.db('articles')
            .select ('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)
            .then( articles => res.json({ data: articles, count, limit }))
            .catch( error => res.status(500).send(error));
    };

    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first()
            .then( article => {
                article.content = article.content.toString();
                return res.json(article);
            })
            .catch( error => res.status(500).send(error));
    };

    const getByCategory = async (req, res) => {
        const categoryId = req.params.id;
        let page = req.query.page || 1;
        page = page <= 0 ? 1 : page;
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId);
        const ids = categories.rows.map( c => c.id );

        app.db({a: 'articles', u: 'users'})
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name'})
            .limit(limit).offset(page * limit - limit) 
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc')
            .then( articles => res.json(articles) )
            .catch( error => res.status(500).send(error));
    };

    return { save, remove, get, getById, getByCategory };
}