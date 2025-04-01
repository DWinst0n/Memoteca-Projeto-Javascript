import renderizarIdeias from "./modeloIdeias.js";
import ControleIdeias from "./controleIdeias.js";

window.addEventListener("load", () => {
    renderizarIdeias();
});

const mainFormulário = document.getElementById("form-container");
mainFormulário.addEventListener("submit", (e) => {
    e.preventDefault();
    ControleIdeias.adicionarIdeia();
});
mainFormulário.querySelector("#botao-cancelar").addEventListener("click", () => ControleIdeias.reiniciarForm());




