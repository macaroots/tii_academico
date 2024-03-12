export default {
    props: {
        nomes: Array,
        nome2: String
    },
    setup(props, {emit}) {
        const nome = Vue.ref(props.nome2)
        const nomes = Vue.ref(props.nomes)
        function inserir() {
            nomes.value.push(nome.value);
        }
        function selecionar(nome) {
            emit('selecionado', nome);
        }
        /*Vue.watch(props.nome, function (novo) {
            nome.value = novo;
        });*/
        return {
            nome,
            nomes,
            inserir,
            selecionar
        }
    },
    template: `
    <form method="post" @submit.prevent="inserir">{{nome2}}
        <div id="resposta"></div>
        <label>
            <span>Nome</span>
            <input name="nome" v-model="nome">
        </label>
        <label>
            <span>Nota1</span>
            <input name="nota1">
        </label>
        <label>
            <span>Nota2</span>
            <input name="nota2">
        </label>
        <label>
            <span>Senha</span>
            <input name="senha" type="password">
        </label>
        <label>
            <span>ID papel</span>
            <input name="id_papel" type="number">
        </label>
        <button>Ok</button>
    </form>
    <button onclick="listar();">Listar</button>
    <table>
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Nota1</th>
            <th>Nota2</th>
            <th></th>
        </tr>
        <tbody id="estudantes">
            <tr v-for="nome of nomes">
                <td>1</td>
                <td>{{nome}}</td>
                <td>4</td>
                <td>7</td>
                <td>
                    <button onclick="editar(1);">Editar</button>
                    <button onclick="apagar(1);">Apagar</button>
                    <button @click="selecionar(nome);">Selecionar</button>
                </td>
            </tr>
        </tbody>
    </table>
    `
}