

class AutorController {
    index(req, res) {
        let autor = {
            nome: 'Renato Lenz',
            formacoes: [
                'Tecnólogo em Telemática',
                'Mestrado em Ciência da Computação'
            ]
        }

        res.render('autor', autor);
    }
}

module.exports = AutorController;