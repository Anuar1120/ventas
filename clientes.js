const body = document.querySelector("#table-body");
const path = "http://localhost:3001/api/v1/clientes";

const clientesBD = {
    "data": [
        { "id": 1, "nombre": "Ana" },
        { "id": 2, "nombre": "Luis" },
        { "id": 3, "nombre": "María" }
    ]
};

async function api(path, options = {}) {
    const response = await fetch(`${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    });
    const payload = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(payload?.error?.message || 'No fue posible completar la operación.');
    }
    return payload?.data;
}

async function render() {
    let filtered = [];

    try {
        const filteredBD = await api(path);
        console.log("Datos de clientes desde la API:", filteredBD);
        filtered = filteredBD || clientesBD.data;
    } catch (error) {
        console.warn("Usando datos locales de clientes debido a un error:", error.message);
        filtered = clientesBD.data;
    }

    body.replaceChildren();

    filtered.forEach(cliente => {
        const row = document.createElement("tr");


        [
            cliente.id,
            cliente.nombre
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);
        });

        body.append(row);
    });
}

render();