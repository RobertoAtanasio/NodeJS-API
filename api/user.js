const bcrypt = require('bcrypt-nodejs');

module.exports = app => {

    const { existsOrError, notExistsOrError, equalOrError } = app.api.validation;

    // const existsOrError2 = validar.existsOrError;
    // const notExistsOrError2 = validar.notExistsOrError;
    // const equalsOrError2 = validar.equalsOrError;

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    };

    const save = async (req, res) => {
        const user = { ...req.body };   // gera um clone do objeto
        if (req.params.id) user.id = req.params.id; // se vier informado o id, é um update, senão, um insert

        // procedimento para evitar a inclusão de usuário ADMIN por usuário não autenticado
        // o req.user.admin) vem do payload do token que está na requisição (auth.js)
        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.name, 'Nome não informado');
            existsOrError(user.email, 'E-Mail não informado');
            existsOrError(user.password, 'Senha não informada');
            existsOrError(user.confirmpassword, 'Confirmação Senha não informada');
            equalOrError(user.password, user.confirmpassword, 'Senhas não conferem');

            if (user.id) {
                const userFromDB = await app.db('users')
                    .where({ id: user.id }).first();
                console.log(user.email);
                console.log(userFromDB.email);
                if (user.email !== userFromDB.email) {
                    // Verificar se o novo email existe
                    const userFromDB = await app.db('users')
                        .where({ email: user.email }).first();
                    if (userFromDB) {
                        throw 'E-Mail informado já existe para o usuário ' + userFromDB.id;
                    } 
                }
            } else {
                const userFromDB = await app.db('users')
                    .where({ email: user.email }).first();
                notExistsOrError(userFromDB, 'Usuário já cadastrado');
            }

            // if (!user.id) {
            //     const userFromDB = await app.db('users')
            //         .where({ email: user.email }).first();
            //     notExistsOrError(userFromDB, 'Usuário já cadastrado');
            // }
        } catch (error) {
            return res.status(400).send(error);
        }

        user.password = encryptPassword(user.password);

        delete user.confirmpassword;

        if (user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then( () => res.status(204).send() )
                .catch( erro => res.status(500).send(erro) );
        } else {
            app.db('users')
                .insert(user)
                .then( () => res.status(204).send() )
                .catch( erro => res.status(500).send(erro) );
        }
    }
    
    const get = (req, res) => {
        // use o select quando se quer filtrar quais campos deve retornar
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .then( users => res.json(users) )
            .catch( erro => res.status(500).send(erro));
    };
    
    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where ({ 'userId': req.params.id });

            notExistsOrError(articles, 'Usuários possui artigos.');
            
            const rowsUpdated = await app.db('users')
                .update({ 'deletedAt': new Date() })
                .where({ id: req.params.id })
                .catch( error => res.status(500).send(error) );
                
            existsOrError(rowsUpdated, 'Usuário não encontrado.' );

            return res.status(204).send();
        } catch (error) {
            return res.status(403).send(error);
        }
    }

    return { save, get, getById, remove }
}