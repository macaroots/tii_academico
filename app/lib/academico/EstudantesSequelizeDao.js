const Estudante = require("./Estudante")
const bcrypt = require('bcrypt')
const { Sequelize, DataTypes, Model } = require('sequelize');

class EstudantesSequelizeDao {
    constructor(sequelize) {
        this.sequelize = sequelize;

        this.Estudante = Estudante.init({
            nome: DataTypes.TEXT,
            nota1: DataTypes.FLOAT,
            nota2: DataTypes.FLOAT,
            senha: DataTypes.TEXT,
            papel: DataTypes.TEXT,
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            }
        }, { sequelize });

        (async () => {
            await this.Estudante.sync();
            console.log('Tabela criada com sucesso!');
        })();
    }
    listar() {
        return this.Estudante.findAll();
    }

    inserir(estudante) {
        this.validar(estudante);
        estudante.senha = bcrypt.hashSync(estudante.senha, 10);
        
        return estudante.save();
    }

    alterar(id, estudante) {
        this.validar(estudante);
        let obj = {...estudante.dataValues};
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key];
            }
        });
        console.log("alterar", obj);
        Estudante.update(obj, { where: { id: id } })
    }

    apagar(id) {
        return Estudante.destroy({ where: { id: id } });
    }

    validar(estudante) {
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

    async autenticar(nome, senha) {
        let estudante = await this.Estudante.findOne({where: {nome}});
        console.log(estudante.senha)
        /*if (bcrypt.compareSync(senha, estudante.senha)) {
            return estudante;
        }*/
        return estudante;
    }
}

module.exports = EstudantesSequelizeDao;