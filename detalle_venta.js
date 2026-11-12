const body = document.querySelector("#table-body");
const path = "http://localhost:3001/api/v1/detalle_venta";

const currency = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0
});

const detalleVentaBD = {
    "data": [
        { "id": 1, "ventaId": 1, "productoId": 2, "cantidad": 2, "subtotal": 200 },
        { "id": 2, "ventaId": 2, "productoId": 1, "cantidad": 1, "subtotal": 600 },
        { "id": 3, "ventaId": 3, "productoId": 3, "cantidad": 3, "subtotal": 250 }
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
        console.log("Datos de detalle de venta desde la API:", filteredBD);
        filtered = filteredBD || detalleVentaBD.data;
    } catch (error) {
        console.warn("Usando datos locales de detalle de venta debido a un error:", error.message);
        filtered = detalleVentaBD.data;
    }

    body.replaceChildren();

    filtered.forEach(detalle => {
        const row = document.createElement("tr");

        [
            detalle.id,
            detalle.ventaId,
            detalle.productoId,
            detalle.cantidad,
            currency.format(detalle.subtotal)
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);
        });

        body.append(row);
    });
}

render();