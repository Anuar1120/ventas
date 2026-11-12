const body = document.querySelector("#table-body");
const path = "http://localhost:3001/api/v1/resumen_ventas_diarias";

const currency = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0
});

const resumenBD = {
    "data": [
        { "fecha": "2026-11-02", "totalVentas": 3, "montoTotal": 2650 },
        { "fecha": "2026-11-01", "totalVentas": 1, "montoTotal": 300 },
        { "fecha": "2026-10-29", "totalVentas": 2, "montoTotal": 850 }
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
        console.log("Datos de resumen diario desde la API:", filteredBD);
        filtered = filteredBD || resumenBD.data;
    } catch (error) {
        console.warn("Usando datos locales de resumen diario debido a un error:", error.message);
        filtered = resumenBD.data;
    }

    body.replaceChildren();

    filtered.forEach(item => {
        const row = document.createElement("tr");

        [
            item.fecha,
            item.totalVentas,
            currency.format(item.montoTotal)
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);
        });

        body.append(row);
    });
}

render();