const Estudante = require("./Estudante")

class EstudantesDao {
    constructor() {
        this.estudantes = [];
    }
    listar() {
        return this.estudantes;
    }

    inserir(estudante) {
        this.validar(estudante);
        this.estudantes.push(estudante);
    }

    alterar(id, estudante) {
        this.validar(estudante);
        this.estudantes[id] = estudante;
    }

    apagar(id) {
        this.estudantes.splice(id, 1);
    }

    validar(estudante) {
        if (estudante.nome == '') {
            throw new Error('mensagem_nome_em_branco');
        }
        if (estudante.nota1 < 0 || estudante.nota1 > 10) {
            throw new Error('mensagem_nota_invalida');
        }
    }
}

module.exports = EstudantesDao;