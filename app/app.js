const http = require('http');
const EstudantesController = require('./controllers/EstudantesController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');

let estudantesController = new EstudantesController();
let estaticoController = new EstaticoController();
let autorController = new AutorController();

const PORT = 3000;
// Controlador Frontal - Front Controller
const server = http.createServer(function (req, res) {
    let [ url, queryString ] = req.url.split('?');

    if (url == '/index') {
        estudantesController.index(req, res);
    }
    else if (url == '/media') {
        estudantesController.media(req, res);
    }
    else if (url == '/autor') {
        autorController.index(req, res);
    }
    else {
        estaticoController.naoEncontrado(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});