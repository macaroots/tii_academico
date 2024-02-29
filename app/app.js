const express = require('express')
const app = express()
const port = 3000

const EstudantesController = require('./controllers/EstudantesController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const EstudantesMongoDao = require('./lib/academico/EstudantesMongoDao');
const EstudantesDao = require('./lib/academico/EstudantesDao');
const Sequelize = require("sequelize");
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const { MongoClient } = require("mongodb");

const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo`;
const mongoClient = new MongoClient(uri);

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SEGREDO_JWT;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('verificação jwt', jwt_payload);
    return done(null, jwt_payload);
}));

app.set('view engine', 'ejs');

let estudantesDao = new EstudantesMongoDao(mongoClient);
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

app.get('/perfil', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
    res.json({'usuario': req.user});
});

app.get('/login', (req, res) => {
    authController.index(req, res);
});

app.post('/logar', (req, res) => {
    authController.logar(req, res);
});

app.get('/lista', async (req, res) => {
    let estudantes = await estudantesDao.listar();
    res.render('lista', {estudantes});
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