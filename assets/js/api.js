const enderecoJsonLocal = "http://localhost:3000/pensamentos";

const api = {
    buscarIdeias: async function () {
        try {
            const res = await fetch(enderecoJsonLocal);
            const ideiasJson = await res.json();
            return ideiasJson;
        } catch (error) {
            console.error("Um erro inesperado aconteceu: " + error);
        }
    },
    adicionarIdeia: async function (pensamento) {
        try {
            const res = await fetch(enderecoJsonLocal, {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify(pensamento),
            });
            return await res.json();
        } catch (error){
            console.log(error);
        }
    },
}
export default api;