const Estudante = require("./Estudante")
const bcrypt = require('bcrypt')

class EstudantesDao {
    constructor() {
        this.estudantes = [];
    }
    listar() {
        return this.estudantes;
    }

    inserir(estudante) {
        this.validar(estudante);
        estudante.senha = bcrypt.hashSync(estudante.senha, 10);
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
        console.log(2, estudante);
        if (!estudante.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!estudante.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
        if (estudante.nota1 < 0 || estudante.nota1 > 10) {
            throw new Error('mensagem_nota_invalida');
        }
    }

    autenticar(nome, senha) {
        for (let estudante of this.listar()) {
            if (estudante.nome == nome && bcrypt.compareSync(senha, estudante.senha)) {
                return estudante;
            }
        }
        return null;
    }
}

module.exports = EstudantesDao;