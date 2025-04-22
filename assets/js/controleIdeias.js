import api from "./api.js";
import renderizarIdeias from "./modeloIdeias.js";

const conteudo = document.getElementById("pensamento-conteudo");
const autor = document.getElementById("pensamento-autoria");
const idReferente =  document.getElementById("pensamento-id");
const idsGerados = new Set();

let acaoFormTitulo = document.getElementById("form-titulo");

let eventoEmAndamento = false;

const ControleIdeias = {
    adicionarIdeia: async function() {
        if (!conteudo.value.trim() || !autor.value.trim()) {
            alert("Preencha os dados da ideia corretamente!"); 
            return;
        }
        const pensamento = {
            id: await ControleIdeias.gerarIdAleatorio(),
            conteudo: conteudo.value,
            autoria: autor.value,
        };
        
        await api.adicionarIdeia(pensamento);
        renderizarIdeias(pensamento);
        this.renderizarIds();
        this.reiniciarForm();
    },
    removerIdeia(ideia) {
        if (eventoEmAndamento === true) {
            this.reiniciarForm();
        }

        const confirmacao = confirm("Deseja excluir esse pensamento?");
        if (confirmacao) {
            ideia.remove();
            api.removerIdeia(ideia);
        }
    },
    editarIdeia: async function () {
        if (!conteudo.value.trim() || !autor.value.trim()) {
            alert("Preencha os dados da ideia corretamente!"); 
            return;
        }

        const ideiaEncontrada = await api.buscarIdeiaPorId(idReferente.value);
        if (!ideiaEncontrada) {
            alert("Ideia não encontrada!");
            return;
        }

        ideiaEncontrada.conteudo = conteudo.value;
        ideiaEncontrada.autoria = autor.value;

        await api.editarIdeia(ideiaEncontrada);
        eventoEmAndamento = false;
        this.reiniciarForm();
        renderizarIdeias();
    },
    curtirIdeia: async function (iconeIdeia, ideia) {
        let favorita;
        if (iconeIdeia.src.endsWith("assets/imagens/favorite_outline.svg")) {
            iconeIdeia.src = "assets/imagens/favorite.svg";
            favorita = true;
        } else {
            iconeIdeia.src = "assets/imagens/favorite_outline.svg";
            favorita = false;
        }

        const ideiaReferente = await api.buscarIdeiaPorId(ideia.id);
        ideiaReferente.favoritada = favorita;

        await api.editarIdeia(ideiaReferente);
        renderizarIdeias();
    },

    gerarIdAleatorio: async function () {
        await this.renderizarIds();
        const caracteres = "abcdefghijklmnopqrstuvwxyz0987654321";
        const caracteresLista = caracteres.split("");
        let caracteresEscolhidos = [];
        let id;
        do {
            for (let i = 0; i < 4; i++) {
                const escolhido = caracteresLista[Math.floor(Math.random() * caracteresLista.length)];
                caracteresEscolhidos.push(escolhido);
            }
            id = caracteresEscolhidos.join("");
        } while (idsGerados.has(id));
        idsGerados.add(id);
        return id;
    },
    renderizarIds: async function () {
        const pensamentos = await api.buscarIdeias();
        pensamentos.forEach(ideia => {
            idsGerados.add(ideia.id)
        });
    },
    reiniciarForm () {
        acaoFormTitulo.textContent = "Adicione um pensamento novo:";
        conteudo.value = "";
        autor.value = "";
        idReferente.value = "";
        if (eventoEmAndamento === true) eventoEmAndamento = false;
        this.alterarDisplay();
    },
    alterarDisplay (justAdd = false) {
        if (eventoEmAndamento == true) {} else {
            const display = [".show__form", ".form__container"];
            display.forEach(elemento => {
                document.querySelector(elemento).classList.toggle("invisivel");
            })
        }

        if (justAdd) {
            eventoEmAndamento = true;
            acaoFormTitulo.textContent = "Adicione um pensamento novo:";
            if (document.getElementById("botao-salvar").classList.contains("invisivel")) {
                this.alterarDisplayBotoes();
            }
        }
    },
    alterarDisplayBotoes() {
        const botoesForm = ["botao-salvar", "botao-editar"];
        botoesForm.forEach(botao => {
         document.getElementById(botao).classList.toggle("invisivel");
        })
    }, 
    mostrarNoForm (ideia) {

        const ideiaTexto = ideia.querySelector(".pensamento-conteudo");
        const ideiaAutor = ideia.querySelector(".pensamento-autoria");

        acaoFormTitulo.textContent = "Edite sua ideia:";
        conteudo.value = ideiaTexto.textContent;
        autor.value = ideiaAutor.textContent;
        idReferente.value = ideia.id;

        const inicioForm = document.getElementById("form-titulo");
        inicioForm.scrollIntoView({ behavior: "smooth"});

        if (document.getElementById("botao-editar").classList.contains("invisivel")) {
            this.alterarDisplayBotoes();
        }
        this.alterarDisplay();
        eventoEmAndamento = true;
    }
};


export default ControleIdeias;