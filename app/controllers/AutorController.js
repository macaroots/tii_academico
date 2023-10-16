const utils = require("../lib/utils")

class AutorController {
    index(req, res) {
        let autor = {
            nome: 'Renato',
            formacoes: [
                'Tecnólogo em Telemática',
                'Mestrado em Ciência da Computação'
            ]
        }

        utils.renderizarEjs(res, './views/autor.ejs', autor);
    }
}

module.exports = AutorController;