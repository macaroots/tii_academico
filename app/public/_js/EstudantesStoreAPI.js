async function listar() {
    let resposta = await fetch('/estudantes');
    let estudantes = await resposta.json();
    return estudantes;
}

async function adicionar(estudante) {
    let dados = new URLSearchParams(estudante);
    console.log(dados);
    let resposta = await fetch('/estudantes', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },   
        body: dados
    });
    if (resposta.status == 200) {
        return await resposta.json();
    }
    else {
        throw new Error(await resposta.text()); 
    }
}


async function deletar(id) {
    let resposta = await fetch('/estudantes/' + id, {
        method: 'delete',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    });
    let respostaJson = await resposta.json();
}