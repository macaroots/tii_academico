const utils = require('./../lib/utils');
const Estudante = require('./../lib/academico/Estudante');
const express = require('express');

class EstudantesController {
    constructor(estudantesDao) {
        this.estudantesDao = estudantesDao;
    }

    getRouter() {
        const rotas = express.Router();
        rotas.get('/', (req, res) => {
            this.listar(req, res)
        });
        rotas.put('/:id', (req, res) => {
            this.alterar(req, res);
        })
        rotas.delete('/:id', (req, res) => {
            this.apagar(req, res);
        })
        rotas.post('/', (req, res, next) => {
            this.inserir(req, res, next);
        })
        rotas.get('/:id', (req, res) => {
            this.procurarPorId(req, res);
        })
        return rotas;
    }

    index(req, res) {
        res.render('index');
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

    async listar(req, res) {
        let estudantes = await this.estudantesDao.listar();
        /**/
        // Alternativa com map()
        let dados = estudantes.map(estudante => {
            return {
                ...estudante,
                // media: estudante.media(),
                // estaAprovado: estudante.estaAprovado()
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
        res.json(dados);
    }

    async procurarPorId(req, res) {
        let id = req.params.id;
        let estudante = await this.estudantesDao.procurarPorId(id);
        // let dados = estudantes.map(estudante => {
        //     return {
        //         ...estudante,
        //         media: estudante.media(),
        //         estaAprovado: estudante.estaAprovado()
        //     };
        // })
        res.json(estudante);
    }
    
    async inserir(req, res, next) {
        console.log("inserir0")
        try {
            let estudante = await this.getEstudanteDaRequisicao(req);
            console.log("inserir", estudante)
            estudante.id = await this.estudantesDao.inserir(estudante);
            res.json({
                estudante: {
                    ...estudante,
                    // media: estudante.media(),
                    // estaAprovado: estudante.estaAprovado()
                },
                mensagem: 'mensagem_estudante_cadastrado'
            });
        } catch (e) {
            console.log("erro inserir", e)
            /*res.status(400).json({
                mensagem: e.message
            });*/
            next(e);
        }
        console.log("inserir2")
    }

    async alterar(req, res) {
        let estudante = await this.getEstudanteDaRequisicao(req);
        let id = req.params.id;
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
        let id = req.params.id;
        this.estudantesDao.apagar(id);
        res.json({
            mensagem: 'mensagem_estudante_apagado',
            id: id
        });
    }

    async getEstudanteDaRequisicao(req) {
        let corpo = req.body;

        let estudante = {
            nome: corpo.nome,
            nota1: parseFloat(corpo.nota1),
            nota2: parseFloat(corpo.nota2),
            senha: corpo.senha,
            papel: corpo.id_papel
        };
        // let estudante = Estudante.build({
        //     nome: corpo.nome,
        //     nota1: parseFloat(corpo.nota1),
        //     nota2: parseFloat(corpo.nota2),
        //     senha: corpo.senha,
        //     papel: corpo.id_papel
        // });
        return estudante;
    }

}

module.exports = EstudantesController;