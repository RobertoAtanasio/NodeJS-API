const schedule = require('node-schedule')

require('colors');

// obs.: incluir este temporizador no consign

module.exports = app => {
    // Execute a cron job every 1 Minutes = */1 * * * *
    schedule.scheduleJob('*/1 * * * *', async function(){
        const usersCount = await app.db('users').count('id').first();
        const categoriesCount = await app.db('categories').count('id').first();
        const articlesCount = await app.db('articles').count('id').first();

        // obter o modelo a partir de stat.js onde foi exportado
        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne( {}, {}, { sort: { 'createdAt': -1 } } )

        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date()
        })

        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeCategories = !lastStat || stat.categories !== lastStat.categories
        const changearticles = !lastStat || stat.articles !== lastStat.articles

        if (changeUsers || changeCategories || changearticles) {
            stat.save().then(() => console.log('[Stats] Estatísticas atualizadas'.blue))
        }
    });
}