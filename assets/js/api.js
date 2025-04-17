const enderecoAtual = window.location.href;
let href = enderecoAtual.split("index.html")[0];
const enderecoJsonLocal = "http://localhost:3000/pensamentos";
const arquivoJson = href + "assets/js/config/db.json";

let usarLocalStorage = false;

async function checkApiAvailability() {
    try {
        const response = await fetch(enderecoJsonLocal, { method: 'HEAD', timeout: 2000 });
        return response.ok;
    } catch (error) {
        console.log("Localhost API não disponível, usando localStorage...");
        return false;
    }
}

async function initializeLocalStorage() {
    try {
        if (!window.localStorage.getItem('pensamentos')) {
            const response = await fetch(arquivoJson);
            if (response.ok) {
                const data = await response.json();
                window.localStorage.setItem('pensamentos', JSON.stringify(data));
                console.log("Dados inicializados do arquivo JSON para localStorage");
            } else {
                window.localStorage.setItem('pensamentos', JSON.stringify([]));
            }
        }
    } catch (error) {
        console.error("Erro ao inicializar localStorage:", error);
        window.localStorage.setItem('pensamentos', JSON.stringify([]));
    }
}

const localStorageOps = {
    buscarIdeias: async function() {
        try {
            const data = JSON.parse(window.localStorage.getItem('pensamentos') || '[]');
            return Array.isArray(data) ? data : data.pensamentos || [];
        } catch (error) {
            console.error(`[Erro em buscarIdeias]: ${error.message}`);
            return [];
        }
    },
    
    buscarIdeiaPorId: async function(id) {
        try {
            const ideias = await this.buscarIdeias(); 
            return ideias.find(idea => idea.id === id) || null;
        } catch (error) {
            console.error(`[Erro em buscarIdeiaPorId]: ${error.message}`);
            return null;
        }
    },
    
    adicionarIdeia: async function(pensamento) {
        try {
            const ideias = await this.buscarIdeias();
            ideias.push(pensamento);
            window.localStorage.setItem('pensamentos', JSON.stringify(ideias));
            return pensamento;
        } catch (error) {
            console.error(`[Erro em adicionarIdeia]: ${error.message}`);
            return null;
        }
    },
    
    editarIdeia: async function(pensamento) {
        try {
            const ideias = await this.buscarIdeias();
            const index = ideias.findIndex(idea => idea.id === pensamento.id);
            
            if (index !== -1) {
                ideias[index] = pensamento;
                window.localStorage.setItem('pensamentos', JSON.stringify(ideias));
                return pensamento;
            }
            return null;
        } catch (error) {
            console.error(`[Erro em editarIdeia]: ${error.message}`);
            return null;
        }
    },
    
    removerIdeia: async function(pensamento) {
        try {
            const ideias = await this.buscarIdeias();
            const filteredIdeias = ideias.filter(idea => idea.id !== pensamento.id);
            window.localStorage.setItem('pensamentos', JSON.stringify(filteredIdeias));
            return true;
        } catch (error) {
            console.error(`[Erro em removerIdeia]: ${error.message}`);
            return false;
        }
    }
};

const apiOps = {
    buscarIdeias: async function() {
        try {
            const res = await fetch(enderecoJsonLocal);
            const ideiasJson = await res.json();
            return ideiasJson;
        } catch (error) {
            console.error(`[Erro em buscarIdeias]: ${error.message}`);
            return [];
        }
    },
    
    buscarIdeiaPorId: async function(id) {
        try {
            const res = await fetch(`${enderecoJsonLocal}/${id}`);
            const ideiaJson = await res.json();
            return ideiaJson;
        } catch (error) {
            console.error(`[Erro em buscarIdeiaPorId]: ${error.message}`);
            return null;
        }
    },
    
    adicionarIdeia: async function(pensamento) {
        try {
            const res = await fetch(enderecoJsonLocal, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pensamento),
            });
            return await res.json();
        } catch (error) {
            console.error(`[Erro em adicionarIdeia]: ${error.message}`);
            return null;
        }
    },
    
    editarIdeia: async function(pensamento) {
        try {
            const res = await fetch(`${enderecoJsonLocal}/${pensamento.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pensamento),
            });
            return await res.json();
        } catch (error) {
            console.error(`[Erro em editarIdeia]: ${error.message}`);
            return null;
        }
    },
    
    removerIdeia: async function(pensamento) {
        try {
            await fetch(`${enderecoJsonLocal}/${pensamento.id}`, {
                method: "DELETE",
            });
            return true;
        } catch (error) {
            console.error(`[Erro em removerIdeia]: ${error.message}`);
            return false;
        }
    }
};

async function initApi() {
    const isApiAvailable = await checkApiAvailability();
    usarLocalStorage = !isApiAvailable;
    
    if (usarLocalStorage) {
        await initializeLocalStorage();
        console.log("Usando localStorage como banco de dados");
    } else {
        console.log("Usando API localhost");
    }
}

const api = {
    init: initApi,
    
    buscarIdeias: async function() {
        return usarLocalStorage ? 
            await localStorageOps.buscarIdeias() : 
            await apiOps.buscarIdeias();
    },
    
    buscarIdeiaPorId: async function(id) {
        return usarLocalStorage ? 
            await localStorageOps.buscarIdeiaPorId(id) : 
            await apiOps.buscarIdeiaPorId(id);
    },
    
    adicionarIdeia: async function(pensamento) {
        return usarLocalStorage ? 
            await localStorageOps.adicionarIdeia(pensamento) : 
            await apiOps.adicionarIdeia(pensamento);
    },
    
    editarIdeia: async function(pensamento) {
        return usarLocalStorage ? 
            await localStorageOps.editarIdeia(pensamento) : 
            await apiOps.editarIdeia(pensamento);
    },
    
    removerIdeia: async function(pensamento) {
        return usarLocalStorage ? 
            await localStorageOps.removerIdeia(pensamento) : 
            await apiOps.removerIdeia(pensamento);
    }
};

export default api;