const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    // criar parâmetros específicos para a questão da estratégia
    // 1. secretOrKey, chave para decodificar o token.
    // 2. procura no cabeçalho da requisição e extrai o token e armazena na variável jwtFromRequest
    // Com essas duas informações se cria a estratégia.
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    // Este payload fa função callback é exatamente o payload passado em auth.js
    // quando se criou o tokem.
    // Se tudo ocorrer bem, chama-se a função done() passando os parâmetros: o 1o parâmetro
    // é o de erro, o 2o, o usuário.
    // Na função done, poderia se passar o user, mas o payload é mais completa.
    // O false no catch diz que não foi possível aplicar a estratégia.
    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? {...payload } : false))
            .catch(err => done(err, false))
    })

    passport.use(strategy)      // vai utilizar essa estratégia

    // Nas rotas vai-se utilizar o autheticate para filtrar as requisições e não permitir
    // que requisições sejam feitas em cima do webservice  que precisam passar pelo
    // passport, precisam ter um usuário logado.
    // Se utilizará a estratégia jwt;
    // session: false, não terá controle de seesão associado a essa autenticação.
    return {
        autheticate: () => passport.authenticate('jwt', { session: false })
    }
}
