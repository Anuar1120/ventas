const body = document.querySelector("#table-body");
const path = "http://localhost:3001/api/v1/productos";

const currency = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0
});

const productosBD = {
    "data": [
        { "id": 1, "nombre": "Laptop Gamer", "precio": 1200, "stock": 10 },
        { "id": 2, "nombre": "Mouse Inalámbrico", "precio": 25, "stock": 50 },
        { "id": 3, "nombre": "Teclado Mecánico", "precio": 75, "stock": 30 }
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
        console.log("Datos de productos desde la API:", filteredBD);
        filtered = filteredBD || productosBD.data;
    } catch (error) {
        console.warn("Usando datos locales de productos debido a un error:", error.message);
        filtered = productosBD.data;
    }

    body.replaceChildren();

    filtered.forEach(producto => {
        const row = document.createElement("tr");


        [
            producto.id,
            producto.nombre,
            currency.format(producto.precio),
            producto.stock
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);
        });

        body.append(row);
    });
}

render();