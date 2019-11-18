module.exports = app => {
    // modelo do BD Mongo
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    })

    // sem filtro, sem selecionar atributo, apenas um sort em ordem descendente por createdAt
    const get = (req, res) => {
        Stat.findOne({}, {}, { sort: { 'createdAt' : -1 } })
            .then(stat => {
                const defaultStat = {
                    users: 0,
                    categories: 0,
                    articles: 0
                }
                res.json(stat || defaultStat)
            })
    }

    return { Stat, get }
}