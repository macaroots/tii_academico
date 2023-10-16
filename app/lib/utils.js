const fs = require('fs');
const ejs = require('ejs');

const utils = {
    decoficarUrl: function (url) {
        let propriedades = url.split('&');
        let query = {};
        for (let propriedade of propriedades) {
            let [ variavel, valor ] = propriedade.split('=');
            query[variavel] = valor;
        }
        return query;
    },

    renderizarEjs: function (res, arquivo, dados) {
        let texto = fs.readFileSync(arquivo, 'utf-8');
        let html = ejs.render(texto, dados);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html);
        res.end();
    }
}

module.exports = utils;