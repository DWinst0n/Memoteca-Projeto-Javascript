import renderizarIdeias from "./modeloIdeias.js";
import ControleIdeias from "./controleIdeias.js";
import api from "./api.js";

const mainFormulário = document.getElementById("form-container");

window.addEventListener("DOMContentLoaded", async () => {
    await api.init();
    
    renderizarIdeias();

    const botaoMostrarForm = document.querySelector(".show__form");
    botaoMostrarForm.onclick = () => {
        ControleIdeias.IrAoForm();
        ControleIdeias.alterarDisplay(true);
    };

    const valorData = document.getElementById("pensamento-data");
    const hoje = ControleIdeias.definirData().toISOS;
    valorData.max = hoje;
    document.getElementById("botao-dataAtual").addEventListener("click", () => {
        valorData.value = hoje;
    })

    mainFormulário.querySelector("#botao-cancelar").addEventListener("click", () => ControleIdeias.reiniciarForm());
    mainFormulário.addEventListener("submit", (e) => {
        e.preventDefault();
        switch (e.submitter.id) {
            case "botao-salvar":
                ControleIdeias.adicionarIdeia();
                break;
            case "botao-editar":
                ControleIdeias.editarIdeia();
                break;
            default:
                break;
        }
    });
    
    const buscaPensamento = document.getElementById("buscaPensamentos");
    let digitacao
    buscaPensamento.addEventListener("input", () => {
    clearTimeout(digitacao);
    digitacao = setTimeout(() => {
        const termoFiltrado = buscaPensamento.value.trim();
        renderizarIdeias(false, termoFiltrado);
    }, 500);
    })
});