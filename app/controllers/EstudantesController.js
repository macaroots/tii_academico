const utils = require('./../lib/utils');
const Estudante = require('./../lib/academico/Estudante');

class EstudantesController {
    constructor(estudantesDao) {
        this.estudantesDao = estudantesDao;
    }
    index(req, res) {
        utils.renderizarEjs(res, './views/index.ejs');
    }
    
    media(req, res) {
        let corpoTexto = '';
        let i = 0;
        req.on('data', function (pedaco) {
            corpoTexto += pedaco;
            console.log(i++, corpoTexto);
        });
        req.on('end', () => {
            // chave=valor&chave2=valor2
            let query = utils.decoficarUrl(corpoTexto);
            
            console.log(query);
            let estudante = new Estudante();
            estudante.nome = query.nome;
            estudante.nota1 = parseFloat(query.nota1);
            estudante.nota2 = parseFloat(query['nota2']);

            if (req.headers.accept == 'application/json') {
                utils.renderizarJSON(res, estudante);
            }
            else {
                utils.renderizarEjs(res, './views/media.ejs', estudante);
            }
        });
    }

    listar(req, res) {
        let estudantes = this.estudantesDao.listar();
        /**/
        // Alternativa com map()
        let dados = estudantes.map(estudante => {
            return {
                ...estudante,
                media: estudante.media(),
                estaAprovado: estudante.estaAprovado()
            };
        })
        /*/
        // Alternativa com for
        let dados = [];
        for (let estudante of estudantes) {
            dados.push({
                ...estudante,
                media: estudante.media(),
                estaAprovado: estudante.estaAprovado()
            });
        }
        /**/
        utils.renderizarJSON(res, dados);
    }
    
    async inserir(req, res) {
        let estudante = await this.getEstudanteDaRequisicao(req);
        try {
            this.estudantesDao.inserir(estudante);
            utils.renderizarJSON(res, {
                estudante: {
                    ...estudante,
                    media: estudante.media(),
                    estaAprovado: estudante.estaAprovado()
                },
                mensagem: 'mensagem_estudante_cadastrado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }

    async alterar(req, res) {
        let estudante = await this.getEstudanteDaRequisicao(req);
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        try {
            this.estudantesDao.alterar(id, estudante);
            utils.renderizarJSON(res, {
                mensagem: 'mensagem_estudante_alterado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }
    
    apagar(req, res) {
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        this.estudantesDao.apagar(id);
        utils.renderizarJSON(res, {
            mensagem: 'mensagem_estudante_apagado',
            id: id
        });
    }

    async getEstudanteDaRequisicao(req) {
        let corpo = await utils.getCorpo(req);
        let estudante = new Estudante(
            corpo.nome,
            parseFloat(corpo.nota1),
            parseFloat(corpo.nota2),
            corpo.senha,
            corpo.papel
        );
        return estudante;
    }

}

module.exports = EstudantesController;