module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation;

    const save = (req, res) => {
        // Modelo de entrada
        // {
        //     "id": "savvsaewe",           no insert não tem o id
        //     "name": "Pai apenas 2",
        //     "parentId": null
        // }

        // const category = { ...req.body };
        // da forma abaixo, garante-se que apenas os campos necessários farão parte
        const category = { 
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
         };

        if (req.params.id) category.id = req.params.id;

        try {
            existsOrError(category.name, "Nome não informado");
        } catch (error) {
            return res.status(400).send(error);
        }

        if (category.id) {
            app.db('categories')
                .update(category)
                .where({ id: category.id})
                .then( () => res.status(204).send())
                .catch( error => res.status(500).send(error));
        } else {
            app.db('categories')
                .insert(category)
                .then( () => res.status(200).send(category))
                .catch( error => res.status(500).send(error));
        }
    };

    const remove = async (req, res) => {
        try {

            existsOrError(req.params.id, 'Código não informado.');

            const subCategory = await app.db('categories')
                .where({ parentId: req.params.id})
                .catch( error => res.status(404).send(error));

            notExistsOrError(subCategory, 'Categoria possui subcategoria.');

            const article = await app.db('articles')
                .where({ categoryId: req.params.id })
                .catch( error => res.status(404).send(error));

            notExistsOrError(article, 'Categoria possui artigo.');

            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
                .catch( error => res.status(500).send(error) );

            existsOrError(rowsDeleted, 'Categoria não encontrada.');

            return res.status(204).send();
        } catch (error) {
            return res.status(500).send(error);
        }
    };

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter( parent => parent.id === parentId );
            return parent.length ? parent[0] : null;    // retorna apenas uma categoria
        }

        // montar o string com a árvore pertencente ao pai
        const categoryWithPath = categories.map( category => {
            let path = category.name;
            let parent = getParent(categories, category.parentId);

            while (parent) {
                path = `${parent.name} > ${path}`;
                parent = getParent(categories, parent.parentId);
            }

            return { ...category, path };
        })

        categoryWithPath.sort( (a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0;
            // return a.path - b.path;
        })

        return categoryWithPath;
    }

    const get = (req, res) => {
        app.db('categories')
            .then( data => res.json(withPath(data)) )
            .catch( erro => res.status(500).send(erro));
    };
    
    const getById = async (req, res) => {
        const category = await app.db('categories')
                .where({ id: req.params.id })
                .first()
                .then( data => res.json(data) )
                .catch( error => res.status(500).send(error) );
    };

    const toTree = (categories, tree) => {
        if (!tree) tree = categories.filter( c => !c.parentId );
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id 
            // cria um nova entrada no objeto de saída que é o atributo children 
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }
    
    const getTree = (req, res) => {
        app.db('categories')
            .then( categories => res.json(toTree(withPath(categories))))
            .catch( erro => res.status(500).send(erro) );
    }

    return { save, remove, get, getById, getTree };
};