const http = require('http');
const EstudantesController = require('./controllers/EstudantesController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const EstudantesDao = require('./lib/academico/EstudantesDao');

let estudantesDao = new EstudantesDao();
let estudantesController = new EstudantesController(estudantesDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(estudantesDao);

const PORT = 3000;
// Controlador Frontal - Front Controller
const server = http.createServer(function (req, res) {
    let [ url, queryString ] = req.url.split('?');
    let urlList = url.split('/');
    url = urlList[1];
    let metodo = req.method;

    if (url == 'index') {
        estudantesController.index(req, res);
    }
    else if (url == 'media') {
        estudantesController.media(req, res);
    }
    else if (url == 'estudantes' && metodo == 'GET') {
        estudantesController.listar(req, res);
    }
    else if (url == 'estudantes' && metodo == 'POST') {
        estudantesController.inserir(req, res);
    }
    else if (url == 'estudantes' && metodo == 'PUT') {
        authController.autorizar(req, res, function() {
            estudantesController.alterar(req, res);
        }, ['admin', 'geral']);
        
    }
    else if (url == 'estudantes' && metodo == 'DELETE') {
        authController.autorizar(req, res, function() {
            estudantesController.apagar(req, res);
        }, ['admin']);
    }
    else if (url == 'autor') {
        autorController.index(req, res);
    }
    else if (url == 'login') {
        authController.index(req, res);
    }
    else if (url == 'logar') {
        authController.logar(req, res);
    }
    else {
        estaticoController.naoEncontrado(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});