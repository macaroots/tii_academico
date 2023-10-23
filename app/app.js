const http = require('http');
const EstudantesController = require('./controllers/EstudantesController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const EstudantesDao = require('./lib/academico/EstudantesDao');

let estudantesDao = new EstudantesDao();
let estudantesController = new EstudantesController(estudantesDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();

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
        estudantesController.alterar(req, res);
    }
    else if (url == 'estudantes' && metodo == 'DELETE') {
        estudantesController.apagar(req, res);
    }
    else if (url == 'autor') {
        autorController.index(req, res);
    }
    else {
        estaticoController.naoEncontrado(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});