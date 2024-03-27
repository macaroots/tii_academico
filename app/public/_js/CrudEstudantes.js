export default {
    props: {
        estudantes: Array,
        nome2: String
    },
    setup(props, {emit}) {
        const nome = Vue.ref(props.nome2)
        const estudanteEditado = Vue.ref({});
        const estudantes = Vue.ref(props.estudantes || [])
        function inserir() {
            //estudantes.value.push({id: estudantes.value.length + 1, nome: nome.value});
            (async () => {
                let id = await adicionar({nome: estudanteEditado.value.nome, nota1: estudanteEditado.value.nota1, nota2: estudanteEditado.value.nota2, senha: estudanteEditado.value.senha})
                alert('Registro #' + id + ' adicionado!')
            })()
        }
        function selecionar(nome) {
            emit('selecionado', nome);
        }
        async function apagar(id) {
            if (confirm('Quer apagar o #' + id + '?')) {
                console.log('apagado', await deletar(id));
            }
        }
        function editar(estudante) {
            estudanteEditado.value = estudante;
        }
        /*Vue.watch(props.nome, function (novo) {
            nome.value = novo;
        });*/
        return {
            nome,
            estudantes,
            estudanteEditado,
            inserir,
            selecionar,
            apagar,
            editar,
        }
    },
    template: `
    <form method="post" @submit.prevent="inserir">{{nome2}}
        <div id="resposta"></div>
        <label>
            <span>Nome</span>
            <input name="nome" v-model="estudanteEditado.nome">
        </label>
        <label>
            <span>Nota1</span>
            <input name="nota1" v-model="estudanteEditado.nota1">
        </label>
        <label>
            <span>Nota2</span>
            <input name="nota2" v-model="estudanteEditado.nota2">
        </label>
        <label>
            <span>Senha</span>
            <input name="senha" type="password" v-model="estudanteEditado.senha">
        </label>
        <label>
            <span>ID papel</span>
            <input name="id_papel" type="number">
        </label>
        <button>Ok</button>
    </form>
    <table>
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Nota1</th>
            <th>Nota2</th>
            <th></th>
        </tr>
        <tbody id="estudantes">
            <tr v-for="estudante of estudantes">
                <td>{{estudante._id}}</td>
                <td>{{estudante.nome}}</td>
                <td>{{estudante.nota1}}</td>
                <td>{{estudante.nota2}}</td>
                <td>
                    <button @click="editar(estudante);">Editar</button>
                    <button @click="apagar(estudante._id);">Apagar</button>
                    <button @click="selecionar(estudante);">Selecionar</button>
                </td>
            </tr>
        </tbody>
    </table>
    `
}