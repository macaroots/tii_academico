const Estudante = require("./Estudante")
const bcrypt = require('bcrypt')

class EstudantesMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }
    listar() {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT * FROM estudantes', function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let estudantes = linhas.map(linha => {
                    let { nome, nota1, nota2, senha, papel } = linha;
                    return new Estudante(nome, nota1, nota2, senha, papel);
                })
                resolve(estudantes);
            });
        });
    }

    inserir(estudante) {
        this.validar(estudante);
        estudante.senha = bcrypt.hashSync(estudante.senha, 10);
        
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO estudantes (nome, nota1, nota2, senha, id_papel) VALUES (?, ?, ?, ?, ?);
            `;
            console.log({sql}, estudante);
            this.pool.query(sql, [estudante.nome, estudante.nota1, estudante.nota2, estudante.senha, 1], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.insertId);
            });
        });
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
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM estudantes WHERE nome=?`;
            this.pool.query(sql, [nome, senha], function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                for (let linha of linhas) {
                    console.log('autenticar', senha, linha);
                    if (bcrypt.compareSync(senha, linha.senha)) {
                        let { nome, nota1, nota2, senha, papel } = linha;
                        return resolve(new Estudante(nome, nota1, nota2, senha, papel));
                    }
                }
                return resolve(null);
            });
        });
    }
}

module.exports = EstudantesMysqlDao;