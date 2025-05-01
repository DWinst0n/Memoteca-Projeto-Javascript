import api from "./api.js";
import ControleIdeias from "./controleIdeias.js";

const listaPensamentos = document.getElementById("lista-pensamentos");

export default async function renderizarIdeias(ideiaNova, filtro) {
    let pensamentos;
    if (ideiaNova) {
        pensamentos = [ideiaNova];
    } else {
        listaPensamentos.innerHTML = "";
        pensamentos = await api.buscarIdeias();
        pensamentos.sort((a,b) => {
            const aPensamento = a.favoritada;
            const bPensamento = b.favoritada;
          
            if (aPensamento && !bPensamento) return -1;
            if (!aPensamento && bPensamento) return 1;
            return 0;
        })
    }
    if (filtro) {
        pensamentos.sort((a, b) => {
            const termo = filtro.toLowerCase();
          
            const aSoma = (a.conteudo.toLowerCase().includes(termo) ? 1 : 0) + (a.autoria.toLowerCase().includes(termo) ? 1 : 0);
            const bSoma = (b.conteudo.toLowerCase().includes(termo) ? 1 : 0) + (b.autoria.toLowerCase().includes(termo) ? 1 : 0);
          
            return bSoma - aSoma;
          });
          const ideiasBuscadas = pensamentos.filter(pensamento => {
            const termo = filtro.toLowerCase();
            return (
              pensamento.conteudo.toLowerCase().includes(termo) ||
              pensamento.autoria.toLowerCase().includes(termo)
            );
          });
          ideiasBuscadas.forEach(ideia => {
            ideia.buscada = true;
          })
    }
    try {
        pensamentos.forEach(ideia => {
            const itemIdeia = document.createElement("li");
            itemIdeia.classList.add("li-pensamento", ...(ideia.buscada ? ["buscado"] : []));
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

            const botaoCurtir =  document.createElement("button");
            botaoCurtir.classList.add("botao-curtir");
            const botaoCurtirImg = document.createElement("img");
            botaoCurtirImg.src = ideia.favoritada? "assets/imagens/favorite.svg" : "assets/imagens/favorite_outline.svg";
            botaoCurtir.append(botaoCurtirImg);
            botaoCurtir.addEventListener("click", () => ControleIdeias.curtirIdeia(ideia));
            
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

            containerBotoes.append(botaoCurtir);
            containerBotoes.append(botaoEditar);
            containerBotoes.append(botaoExcluir);

            const dataPensamento = document.createElement("p");
            dataPensamento.classList.add("pensamento-data");

            const data = ControleIdeias.definirData(ideia.data).completa;

            dataPensamento.textContent = data;
            itemIdeia.append(dataPensamento);

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