function calcularMedia() {
    let inputNome = document.querySelector('[name=nome]');
    let nome = inputNome.value;
    let inputNota1 = document.querySelector('[name=nota1]');
    let nota1 = parseFloat(inputNota1.value);
    let inputNota2 = document.querySelector('[name=nota2]');
    let nota2 = parseFloat(inputNota2.value);
    let inputSenha = document.querySelector('[name=senha]');
    let senha = parseFloat(inputSenha.value);
    let inputPapel = document.querySelector('[name=id_papel]');
    let id_papel = parseFloat(inputPapel.value);

    /*
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
    */

    inserir({
        nome, nota1, nota2, senha, id_papel
    });
    listar();
}

let traducoes = {
    'pt-BR': {
        'mensagem_senha_em_branco': 'A senha não pode ser em branco!',
        'mensagem_estudante_cadastrado': 'Estudante cadastrado com sucesso!',
        'mensagem_estudante_apagado': 'Estudante apagado com sucesso!'
    },
    'en': {
        'mensagem_senha_em_branco': 'Password cannot be empty!'
    }
}

async function inserir(estudante) {
    console.log('inserindo', estudante);
    let divResposta = document.querySelector('#resposta');
    let dados = new URLSearchParams(estudante);
    console.log(dados);
    let resposta = await fetch('estudantes', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },   
        body: dados
    });
    if (resposta.status == 200) {
        divResposta.classList.add('aprovado');
        divResposta.classList.remove('reprovado');
    }
    else {
        divResposta.classList.add('reprovado');
        divResposta.classList.remove('aprovado');
    }
    let respostaJson = await resposta.json();
    let mensagem = respostaJson.mensagem;
    divResposta.innerText = traducoes['pt-BR'][mensagem];
}

async function listar() {
    let divEstudantes = document.querySelector('#estudantes');
    divEstudantes.innerText = 'Carregando...'
    let resposta = await fetch('estudantes');
    let estudantes = await resposta.json();
    divEstudantes.innerHTML = '';
    for (let estudante of estudantes) {
        let linha = document.createElement('tr');
        let colunaId = document.createElement('td');
        let colunaNome = document.createElement('td');
        let colunaNota1 = document.createElement('td');
        let colunaNota2 = document.createElement('td');
        let colunaAcoes = document.createElement('td');
        let botaoEditar = document.createElement('button');
        let botaoApagar = document.createElement('button');
        colunaId.innerText = estudante.id;
        colunaNome.innerText = estudante.nome;
        colunaNota1.innerText = estudante.nota1;
        colunaNota2.innerText = estudante.nota2;
        botaoEditar.innerText = 'Editar';
        botaoEditar.onclick = function () {
            editar(estudante.id);
        }
        botaoApagar.onclick = function () {
            apagar(estudante.id);
        }
        botaoApagar.innerText = 'Apagar';
        linha.appendChild(colunaId);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaNota1);
        linha.appendChild(colunaNota2);
        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoApagar);
        linha.appendChild(colunaAcoes);
        divEstudantes.appendChild(linha);
    }
}

function editar(id) {
    alert('editar' + id);
}

async function apagar(id) {
    let divResposta = document.querySelector('#resposta');
    if (confirm('Quer apagar o #' + id + '?')) {
        let resposta = await fetch('estudantes/' + id, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
        listar();
    }
}

