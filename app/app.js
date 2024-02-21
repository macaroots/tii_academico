const express = require('express')
const app = express()
const port = 3000

const EstudantesController = require('./controllers/EstudantesController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const EstudantesSequelizeDao = require('./lib/academico/EstudantesSequelizeDao');
const EstudantesDao = require('./lib/academico/EstudantesDao');
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.MARIADB_DATABASE,
    'root',
    process.env.MARIADB_PASSWORD,
    {
        host: 'bd',
        dialect: 'mysql'
    }
);

app.set('view engine', 'ejs');

let estudantesDao = new EstudantesSequelizeDao(sequelize);
let estudantesController = new EstudantesController(estudantesDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(estudantesDao);

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

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
app.get([
    '/',
    '/index'
    ], (req, res) => {
        console.log('custom', req.dadosPersonalizados); // { chave: 'valor' }
        estudantesController.index(req, res)
});
  
app.use((req, res, next) => {
    res.locals.dadosPersonalizados = { chave: 'valor' };
    console.log('middleware 2')
    next();
});

app.get('/autor', (req, res) => {
    autorController.index(req, res);
});
app.use((err, req, res, next) => {
//   if (err.name === 'UnauthorizedError') {
    console.log('erro', err);
    res.status(401).send('Não autorizado');
//   } else {
//     next(err);
//   }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})