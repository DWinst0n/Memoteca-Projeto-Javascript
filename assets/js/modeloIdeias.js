import api from "./api.js";

const pensamentos = await api.buscarIdeias();
const listaPensamentos = document.getElementById("lista-pensamentos");

export default function renderizarIdeias () {
    pensamentos.forEach(ideia => {
        const itemIdeia = document.createElement("li");
        itemIdeia.classList.add("li-pensamento");
        itemIdeia.dataset.id = ideia.id;

        const aspasImg = document.createElement("img");
        aspasImg.src = "assets/imagens/aspas-azuis.png";
        aspasImg.alt = "Aspas Azuis";
        aspasImg.classList.add("icone-aspas");
        itemIdeia.append(aspasImg);

        const conteudo = document.createElement("p");
        conteudo.classList.add("pensamento-conteudo");
        conteudo.textContent = ideia.conteudo;
        itemIdeia.append(conteudo);

        const autoria = document.createElement("p");
        autoria.classList.add("pensamento-autoria");
        autoria.textContent = ideia.autoria;
        itemIdeia.append(autoria);

        listaPensamentos.append(itemIdeia);
    });
}


