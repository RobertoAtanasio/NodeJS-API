
// não será passada via o consign. Vamos imortá-la diretamente

module.exports = middleware => {
    return (req, res, next) => {
        // o req.user.admin) vem do payload do token que está na requisição (auth.js)
        if (req.user.admin) {
            middleware(req, res, next) 
        } else {
            res.status(401).send('Usuário não é administrador.')
        }
    }
}