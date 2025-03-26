
const enderecoAtual = window.location.href;
let href = enderecoAtual.split("index.html")[0];
const enderecoJson = href + "assets/js/config/db.json";

async function retornarJson() {
    const res = await fetch(enderecoJson);
    const ideiasJson = (await res.json()).pensamentos;
    ideiasJson.forEach(ideia => {
        console.table(ideia);
    });
}
retornarJson();
