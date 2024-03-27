const Estudante = require("./Estudante")
const bcrypt = require('bcrypt')

class EstudantesMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }
    listar() {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT e.id, e.nome, e.nota1, e.nota2, p.nome as papel FROM estudantes e JOIN papeis p ON e.id_papel = p.id', function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let estudantes = linhas.map(linha => {
                    console.log('linha', linha);
                    let { id, nome, nota1, nota2, senha, papel } = linha;
                    return new Estudante(nome, nota1, nota2, senha, papel, id);
                })
                resolve(estudantes);
            });
        });
    }

    procurarPorId(id) {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT e.id, e.nome, e.nota1, e.nota2, p.nome as papel FROM estudantes e JOIN papeis p ON e.id_papel = p.id WHERE e.id = ?', [id], function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let estudantes = linhas.map(linha => {
                    console.log('linha', linha);
                    let { id, nome, nota1, nota2, senha, papel } = linha;
                    return new Estudante(nome, nota1, nota2, senha, papel, id);
                })
                resolve(estudantes[0]);
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
            this.pool.query(sql, [estudante.nome, estudante.nota1, estudante.nota2, estudante.senha, estudante.id_papel], function (error, resultado, fields) {
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
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM estudantes WHERE id=?;`;
            this.pool.query(sql, [id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(id);
            });
        });
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
            let sql = `SELECT e.*, p.nome as papel FROM estudantes e JOIN papeis p ON e.id_papel = p.id WHERE e.nome=?`;
            this.pool.query(sql, [nome, senha], function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                for (let linha of linhas) {
                    console.log('autenticar', senha, linha);
                    if (bcrypt.compareSync(senha, linha.senha)) {
                        let { id, nome, nota1, nota2, senha, papel } = linha;
                        return resolve(new Estudante(nome, nota1, nota2, senha, papel, id));
                    }
                }
                return resolve(null);
            });
        });
    }
}

module.exports = EstudantesMysqlDao;