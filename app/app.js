const express = require('express')
const app = express()
const port = 3000

const EstudantesController = require('./controllers/EstudantesController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const EstudantesMysqlDao = require('./lib/academico/EstudantesMysqlDao');
const EstudantesDao = require('./lib/academico/EstudantesDao');
const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'bd',
    user            : process.env.MARIADB_USER,
    password        : process.env.MARIADB_PASSWORD,
    database        : process.env.MARIADB_DATABASE
});

let estudantesDao = new EstudantesMysqlDao(pool);
let estudantesController = new EstudantesController(estudantesDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(estudantesDao);

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use((req, res, next) => {
    res.locals.dadosPersonalizados = { chave: 'valor' };
    console.log('middleware 0')
    next();
});
app.use('/estudantes', estudantesController.getRouter());

app.use((req, res, next) => {
    res.locals.dadosPersonalizados = { chave: 'valor' };
    console.log('middleware 1')
    next();
});
app.get('/', (req, res) => {
    console.log('custom', res.locals.dadosPersonalizados); // { chave: 'valor' }

    res.send('Página inicial');
});
  
app.use((req, res, next) => {
    res.locals.dadosPersonalizados = { chave: 'valor' };
    console.log('middleware 2')
    next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})