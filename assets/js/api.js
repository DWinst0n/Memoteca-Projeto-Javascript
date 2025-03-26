const enderecoAtual = window.location.href;
let href = enderecoAtual.split("index.html")[0];
const enderecoJson = href + "assets/js/config/db.json";

const api = {
    buscarIdeias: async function pensamentosJson() {
        const res = await fetch(enderecoJson);
        const ideiasJson = (await res.json());
        const ideias = ideiasJson.pensamentos;
        return ideias;
    },
}
export default api;