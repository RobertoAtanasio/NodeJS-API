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
            return res.status(400).send('Usuário não encontrado');
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
            exp: now + (60 * 60 * 24 * 1)
            // exp: now + 10
        }

        // console.log({...payload, token: jwt.encode(payload, authSecret)});

        return res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {

        // Obs.: Coloquei o setTimeout para apenas simular um tempo de espera. Não é necessário.
        // setTimeout( function() { 
            const userData = req.body || null;
            try {
                if (userData) {
                    const token = jwt.decode(userData.token, authSecret)
                    if (new Date(token.exp * 1000) > Date.now()) {
                        return res.send(true)
                    }
                }
            } catch (error) {
                // problema com o token            
            }
            return res.send(false);
        // }, 1000);

        
    }

    const validateAdmin = async (req, res) => {
        const userData = req.body || null;
        try {
            if (userData) {
                const token = jwt.decode(userData.token, authSecret)
                if (token.admin) {
                    return res.send(true)
                }
            }
        } catch (error) {
            // problema com o token            
        }
        return res.send(false);
    }

    return { signin, validateToken, validateAdmin }
}