const express = require('express')
const app = express()
const port = 3000

const EstudantesController = require('./controllers/EstudantesController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const EstudantesMysqlDao = require('./lib/academico/EstudantesMysqlDao');
const EstudantesMongoDao = require('./lib/academico/EstudantesMongoDao');
const EstudantesDao = require('./lib/academico/EstudantesDao');
// const Sequelize = require("sequelize");
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const { MongoClient } = require("mongodb");
// const mysql = require('mysql2');
const webpush = require('web-push');

const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo`;
const mongoClient = new MongoClient(uri);

// const pool  = mysql.createPool({
//     connectionLimit : 10,
//     host            : 'bd',
//     user            : process.env.MARIADB_USER,
//     password        : process.env.MARIADB_PASSWORD,
//     database        : process.env.MARIADB_DATABASE
// });

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SEGREDO_JWT;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log('verificação jwt', jwt_payload);
    return done(null, jwt_payload);
}));

app.set('view engine', 'ejs');

// let estudantesDao = new EstudantesMysqlDao(pool);
let estudantesDao = new EstudantesMongoDao(mongoClient);
let estudantesController = new EstudantesController(estudantesDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(estudantesDao);

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Defina as chaves VAPID - você pode gerar essas chaves usando o web-push
webpush.setVapidDetails(
    'mailto:seuemail@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

let subscriptions = [];
// Rota para salvar as subscrições
app.post('/subscribe', (req, res) => {
    subscription = req.body;
    subscriptions.push(subscription);
    console.log({ subscriptions });
    res.status(201).json({});
});

app.get('/push', (req, res) => {
    res.render('push');
})

// Rota para enviar notificações
app.get('/notificar', (req, res) => {
    const payload = JSON.stringify({ title: req.query.msg });
    console.log('notificando', subscriptions);
    for (let subscription of subscriptions) {
        webpush.sendNotification(subscription, payload)
            .catch(error => console.error('Erro ao notificar:', error));
        console.log('notificando', subscription);
    }
    res.send('ok');
});

app.use('/estudantes', estudantesController.getRouter());

app.get([
    '/',
    '/index'
], (req, res) => {
    estudantesController.index(req, res)
});

app.get('/autor', (req, res) => {
    autorController.index(req, res);
});

app.get('/perfil', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
    res.json({ 'usuario': req.user });
});

app.get('/login', (req, res) => {
    authController.index(req, res);
});

app.post('/logar', (req, res) => {
    authController.logar(req, res);
});

app.get('/lista', async (req, res) => {
    let estudantes = await estudantesDao.listar();
    if (req.headers.accept == 'application/json') {
        res.json(estudantes);
    }
    else {
        res.render('lista', { estudantes });
    }
});

app.get('*', (req, res, next) => {
    res.status(404).send('Nao encontrado')
});

app.use(function (err, req, res, next) {
    console.error('registrando erro: ', err.stack)
    res.status(500).send('Erro no servidor: ' + err.message);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})