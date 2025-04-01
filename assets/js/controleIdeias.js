import api from "./api.js";
import renderizarIdeias from "./modeloIdeias.js";

const conteudo = document.getElementById("pensamento-conteudo");
const autor = document.getElementById("pensamento-autoria");

const ControleIdeias = {
    adicionarIdeia() {
        const pensamento = {
            id: this.gerarIdAleatorio(),
            conteudo: conteudo.value,
            autoria: autor.value,
        };
        api.adicionarIdeia(pensamento);
        renderizarIdeias(pensamento);
        this.reiniciarForm();
    },

    removerIdeia(ideia) {
        const confirmacao = confirm("Deseja excluir esse pensamento?");
        if (confirmacao) ideia.remove();
    },

    editarIdeia(ideia) {
        const ideiaTexto = ideia.querySelector(".pensamento-conteudo");
        const ideiaAutor = ideia.querySelector(".pensamento-autoria");

        ideiaTexto.textContent = prompt("Edite sua nova ideia - O texto");
        ideiaAutor.textContent = prompt("Edite sua nova ideia - O Autor");
    },

    gerarIdAleatorio() {
        const caracteres = "abcdefghijklmnopqrstuvwxyz0987654321";
        const caracteresLista = caracteres.split("");
        let caracteresEscolhidos = [];

        for (let i = 0; i < 4; i++) {
            const escolhido = caracteresLista[Math.floor(Math.random() * caracteresLista.length)];
            caracteresEscolhidos.push(escolhido);
        }
        return caracteresEscolhidos.join("");
    },
    reiniciarForm () {
        conteudo.value = "";
        autor.value = "";
    }
};

export default ControleIdeias;