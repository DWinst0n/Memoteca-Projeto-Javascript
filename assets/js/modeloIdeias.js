import api from "./api.js";
import ControleIdeias from "./controleIdeias.js";

const listaPensamentos = document.getElementById("lista-pensamentos");

export default async function renderizarIdeias(ideiaNova) {
    let pensamentos;
    if (ideiaNova) {
        pensamentos = [ideiaNova];
    } else {
        listaPensamentos.innerHTML = "";
        pensamentos = await api.buscarIdeias();
    }
    try {
        if (!Array.isArray(pensamentos)) {
            console.error("Erro: pensamentos não é um array", pensamentos);
            pensamentos = [];
        }

        pensamentos.forEach(ideia => {
            const itemIdeia = document.createElement("li");
            itemIdeia.classList.add("li-pensamento");
            itemIdeia.id = ideia.id;

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

            const containerBotoes = document.createElement("div");
            containerBotoes.classList.add("icones");
            itemIdeia.append(containerBotoes);
            
            const botaoEditar = document.createElement("button");
            botaoEditar.classList.add("botao-editar");
            const botaoEditarImg = document.createElement("img");
            botaoEditarImg.src = "assets/imagens/icone-editar.png";
            botaoEditar.append(botaoEditarImg);
            botaoEditar.addEventListener("click", () => ControleIdeias.mostrarNoForm(itemIdeia));
            
            const botaoExcluir = document.createElement("button");
            botaoExcluir.classList.add("botao-excluir");
            const botaoExcluirImg = document.createElement("img");
            botaoExcluirImg.src = "assets/imagens/icone-excluir.png";
            botaoExcluir.append(botaoExcluirImg);
            botaoExcluir.addEventListener("click", () => ControleIdeias.removerIdeia(itemIdeia));

            containerBotoes.append(botaoEditar);
            containerBotoes.append(botaoExcluir);

            listaPensamentos.append(itemIdeia);
        });

        const listaVaziaMensagem = document.querySelector(".lista__vazia");
        if (listaPensamentos.childElementCount === 0) {
            listaVaziaMensagem.style.display = "flex";
        } else {
            listaVaziaMensagem.style.display = "none";
        }
    } catch (error) {
        console.error("Erro ao renderizar ideias: ", error);
    }
}