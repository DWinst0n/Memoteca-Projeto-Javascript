import api from "./api.js";
import renderizarIdeias from "./modeloIdeias.js";

const conteudo = document.getElementById("pensamento-conteudo");
const autor = document.getElementById("pensamento-autoria");
const idReferente = document.getElementById("pensamento-id");
const data =  document.getElementById("pensamento-data");
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
            data: data.value? this.definirData(data.value) : this.definirData()
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
    curtirIdeia: async function (ideia) {
        let favorita;
        if (!ideia.favoritada) {
            favorita = true;
        } else {
            favorita = false;
        }
        const ideiaReferente = await api.buscarIdeiaPorId(ideia.id);
        ideiaReferente.favoritada = favorita;
        await api.editarIdeia(ideiaReferente);
        renderizarIdeias();
    },
    definirData(data) {
        const dataReferente = data? new Date(data) : new Date();
        const diaSemana = dataReferente.toLocaleDateString('pt-BR', { weekday: "long" });
        const diaValor = String(dataReferente.getDate()).padStart(2, "0");
        const mes = (dataReferente.toLocaleDateString('pt-BR', {month: "long"}));
        const ano = dataReferente.getFullYear();
        const utc = dataReferente.toISOString().split("T")[0];
        return {
            diaSemana,
            diaValor,
            mes,
            ano,
            completa: `${diaSemana}, ${diaValor} de ${mes} de ${ano}`,
            utc
        };    
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

        this.IrAoForm();

        if (document.getElementById("botao-editar").classList.contains("invisivel")) {
            this.alterarDisplayBotoes();
        }
        this.alterarDisplay();
        eventoEmAndamento = true;
    },
    IrAoForm () {
        const inicioForm = document.getElementById("form-titulo");
        inicioForm.scrollIntoView({ behavior: "smooth"});
    }
};


export default ControleIdeias;