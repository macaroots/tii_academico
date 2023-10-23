class Estudante {
    constructor(nome, nota1, nota2) {
        this.nome = nome;
        this.nota1 = nota1;
        this.nota2 = nota2;
    }
    media() {
        let media = (this.nota1 + this.nota2) / 2;
        return media;
    }

    estaAprovado() {
        return this.media() > 6;
    }

}

module.exports = Estudante;