const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy , ExtractJwt } = passportJwt

// let JwtStrategy  = require('passport-jwt').Strategy
// let ExtractJwt = require('passport-jwt').ExtractJwt;

// ver: https://www.npmjs.com/package/passport-jwt

module.exports = app => {
    // criar parâmetros específicos para a questão da estratégia
    // 1. secretOrKey, chave para decodificar o token.
    // 2. procura no cabeçalho da requisição e extrai o token e armazena na variável jwtFromRequest
    // Com essas duas informações se cria a estratégia.
    const options = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    // let options = {}
    // options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    // options.secretOrKey = authSecret;

    // Este payload da função callback é exatamente o payload passado em auth.js
    // quando se criou o token.
    // Se tudo ocorrer bem, chama-se a função done() passando os parâmetros: o 1o parâmetro
    // é o de erro, o 2o, o usuário.
    // Na função done, poderia se passar o user, mas o payload é mais completo.
    // O false no catch diz que não foi possível aplicar a estratégia.
    const jwtstrategy = new Strategy (options, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? {...payload } : false))
            .catch(err => done(err, false))
    })

    passport.use(jwtstrategy)      // vai utilizar essa estratégia

    // Nas rotas vai-se utilizar o autheticate para filtrar as requisições e não permitir
    // que requisições sejam feitas em cima do webservice  que precisam passar pelo
    // passport, precisam ter um usuário logado.
    // Se utilizará a estratégia jwt;
    // session: false, não terá controle de seesão associado a essa autenticação.
    return {
        // Via link acima do passport-jwt, versão sessão 'Authenticate requests'
        autheticate: () => passport.authenticate('jwt', { session: false })
    }
}
