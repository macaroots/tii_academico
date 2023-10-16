class EstaticoController {
    naoEncontrado(req, res) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
        </head>
        <body>`);
        res.write('<h1>Não encontrado!</h1>');
        res.write(`</body>
        </html>`);
        res.end();
    }
}

module.exports = EstaticoController;