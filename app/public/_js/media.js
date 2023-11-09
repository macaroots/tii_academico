function calcularMedia() {
    let inputNome = document.querySelector('[name=nome]');
    let nome = inputNome.value;
    let inputNota1 = document.querySelector('[name=nota1]');
    let nota1 = parseFloat(inputNota1.value);
    let inputNota2 = document.querySelector('[name=nota2]');
    let nota2 = parseFloat(inputNota2.value);

    let media = (nota1 + nota2) / 2;
    let aprovado = media > 6;

    let divResposta = document.querySelector('#resposta');
    let div = document.createElement('div');
    div.textContent = 'Olá, ' + nome + '! Você tirou ' + nota1 + ' e ' + nota2  + '. Ficou com média ' + media;
    if (aprovado) {
        div.classList.add('aprovado');
        div.classList.remove('reprovado');
    }
    else {
        div.classList.remove('aprovado');
        div.classList.add('reprovado');
    }

    divResposta.append(div);
}