class Estudante {
    media() {
        let media = (this.nota1 + this.nota2) / 2;
        return media;
    }

    estaAprovado() {
        return this.media() > 6;
    }

}

module.exports = Estudante;