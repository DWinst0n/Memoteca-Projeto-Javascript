import api from "./api.js";
import renderizarIdeias from "./modeloIdeias.js";

const conteudo = document.getElementById("pensamento-conteudo");
const autor = document.getElementById("pensamento-autoria");

let proseguir = true;

const ControleIdeias = {
    adicionarIdeia() {
        if (!conteudo.value.trim() || !autor.value.trim()) {
            alert("Preencha os dados da ideia corretamente!"); 
            return;
        }
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

        const inicioForm = document.getElementById("form-titulo");
        inicioForm.scrollIntoView({ behavior: "smooth"});

        this.alterarAcaoForm();

        conteudo.value = ideiaTexto.textContent;
        autor.value = ideiaAutor.textContent;
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
    },
    alterarAcaoForm (acaoRealizada) {
        if (acaoRealizada) {
            proseguir = true;
        }
        if (proseguir) {
            const botoesForm = ["botao-salvar", "botao-editar"];
            botoesForm.forEach(botao => {
             document.getElementById(botao).classList.toggle("invisivel");
            })
        } else {return;}
        proseguir = false;
    }
};

export default ControleIdeias;