import renderizarIdeias from "./modeloIdeias.js";
import ControleIdeias from "./controleIdeias.js";
import api from "./api.js";

const mainFormulário = document.getElementById("form-container");

window.addEventListener("DOMContentLoaded", () => {
    renderizarIdeias();

    mainFormulário.addEventListener("submit", (e) => {
        e.preventDefault();
        switch (e.submitter.id) {
            case "botao-salvar":
                  ControleIdeias.adicionarIdeia();
                    break
            case "botao-editar":
                ControleIdeias.editarIdeia();
                break
            default:
                break;
        }
   });
    mainFormulário.querySelector("#botao-cancelar").addEventListener("click", () => ControleIdeias.reiniciarForm());
    const botaoMostrarForm = document.querySelector(".show__form");
    botaoMostrarForm.onclick = () => ControleIdeias.alterarDisplay(true);
});

const idsGerados = new Set();
const pensamentos = await api.buscarIdeias();
pensamentos.forEach(ideia => {
    idsGerados.add(ideia.id)
});
console.log(idsGerados)