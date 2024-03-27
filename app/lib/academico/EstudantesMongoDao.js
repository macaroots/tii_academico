const Estudante = require("./Estudante")
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId;

class EstudantesMongoDao {
    constructor(client) {
        this.client = client;
        this.banco = 'academico';
        this.colecao = 'estudantes';
    }
    async listar() {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        const estudantes = await collection.find();
        return await estudantes.toArray()
    }
    async procurarPorId(id) {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        const estudante = await collection.findOne({_id: new ObjectId(id)});
        return estudante;   
    }

    async inserir(estudante) {
        this.validar(estudante);
        estudante.senha = bcrypt.hashSync(estudante.senha, 10);
        
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        return await collection.insertOne(estudante);
    }

    alterar(id, estudante) {
        this.validar(estudante);
        this.estudantes[id] = estudante;
    }

    async apagar(id) {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        const estudante = await collection.deleteOne({_id: new ObjectId(id)});
        return estudante; 
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

    async autenticar(nome, senha) {

        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        const estudante = await collection.findOne({nome});
        if (bcrypt.compareSync(senha, estudante.senha)) {
            let { id, nome, nota1, nota2, senha, papel } = estudante;
            return new Estudante(nome, nota1, nota2, senha, papel, id);
        }
        return null; 
    }
}

module.exports = EstudantesMongoDao;