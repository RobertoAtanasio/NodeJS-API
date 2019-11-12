const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha');
        }

        const user = await app.db('users')
            .where ({ email: req.body.email })
            .first();

        if (!user) {
            return res.status(400).send('Usuário nap encontrado');
        }

        const isMatch = bcrypt.compareSync(req.body.password, user.password);

        if (!isMatch) {
            return res.status(401).send('EMail/Senha inválido');
        }

        const now = Math.floor(Date.now() / 1000);    // data atual em segundos

        // criar o conteúdo do token
        // iat = issued at time (emitido na data)
        // now + (60 * 60 * 24 * 3) equivale a 3 dias a partir de hoje
        // Por padrão, utilizar os nome iat e exp para as datas de validade.

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        return res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateTpken = async (req, res) => {
        const userData = req.body || null;
        try {
            if (userData) {
                const token = jwt.decode(userdata.token, authSecret)
                if (new Date(token.exp * 1000) > Date.now()) {
                    return res.send(true)
                }
            }
        } catch (error) {
            // problema com o token            
        }
        return res.send(false);
    }

    return { signin, validateTpken }
}