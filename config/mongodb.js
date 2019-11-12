// const mongoose = require('mongoose');

const url = 'mongodb+srv://usuario_admin:egito001@clusterapi-hto5v.mongodb.net/test?retryWrites=true&w=majority'
// const options = { 
//     reconnectTries: Number.MAX_VALUE, 
//     reconnectInterval: 500, 
//     poolSize: 5, 
//     useNewUrlParser: true 
// }
// mongoose.connect(url, options)
//     .catch(e => {
//         const msg = 'ERRO! Não foi possível conectar com o MongoDB!'
//         console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
//     })


require('colors');

const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost/knowledge_stats', { useNewUrlParser: true })
mongoose.connect( url, { useNewUrlParser: true })
    .then(c => {
        console.log('Aplicação conectada ao Banco de Dados MongoDB'.green);
    })
    .catch(e => {
        const msg = 'ERRO! Não foi possível conectar com o MongoDB!'
        console.log(msg.red)
        // console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
    })

// mongoose.connection.on( 'error', (err) => {
//     console.log('Erro na conexão com o banco de dados: ' + erro);
// });

// mongoose.connection.on( 'disconnected', () => {
//     console.log('Banco de dados desconectado');
// });

// mongoose.connection.on( 'connected', () => {
//     console.log('Aplicação conectada ao Banco de Dados.');
// });