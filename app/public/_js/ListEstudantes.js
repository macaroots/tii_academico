export default {
    props: {
        estudantes: Array
    },
    setup(props, {emit}) {
        const estudantes = Vue.ref(props.estudantes)
        function selecionar(estudante) {
            // emit('selecionado', estudante);
            this.$router.push('/detalhes/' + estudante.id);
        }
        return {
            estudantes,
            selecionar
        }
    },
    template: `
    <h2>Lista</h2>
    <div v-for="estudante of estudantes">
        {{estudante.nome}}
        <button @click="selecionar(estudante);">Selecionar</button>
    </div>
    `
}