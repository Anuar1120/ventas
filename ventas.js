const ventasBD = {
    "success": true,
    "data": [
        {
            "id": 8,
            "clienteId": 2,
            "fechaVenta": "2026-11-02 15:11:20",
            "estado": "CONFIRMADA",
            "fechaModificacion": "2026-11-02 15:11:35",
            "cliente": { "id": 2, "nombre": "Luis" },
            "total": 1200
        },
        {
            "id": 7,
            "clienteId": 1,
            "fechaVenta": "2026-11-02 08:00:00",
            "estado": "CONFIRMADA",
            "fechaModificacion": "2026-11-02 09:03:40",
            "cliente": { "id": 1, "nombre": "Ana" },
            "total": 1200
        },
        {
            "id": 6,
            "clienteId": 3,
            "fechaVenta": "2026-11-02 07:20:00",
            "estado": "CONFIRMADA",
            "fechaModificacion": "2026-11-02 09:03:40",
            "cliente": { "id": 3, "nombre": "María" },
            "total": 250
        },
        {
            "id": 5,
            "clienteId": 2,
            "fechaVenta": "2026-11-01 09:00:00",
            "estado": "CONFIRMADA",
            "fechaModificacion": "2026-11-02 09:03:40",
            "cliente": { "id": 2, "nombre": "Luis" },
            "total": 300
        },
        {
            "id": 4,
            "clienteId": 1,
            "fechaVenta": "2026-10-29 18:10:00",
            "estado": "ANULADA",
            "fechaModificacion": "2026-11-02 09:03:40",
            "cliente": { "id": 1, "nombre": "Ana" },
            "total": 600
        },
        {
            "id": 3,
            "clienteId": 3,
            "fechaVenta": "2026-10-29 08:15:00",
            "estado": "CONFIRMADA",
            "fechaModificacion": "2026-11-02 09:03:40",
            "cliente": { "id": 3, "nombre": "María" },
            "total": 250
        },
        {
            "id": 2,
            "clienteId": 2,
            "fechaVenta": "2026-10-28 12:00:00",
            "estado": "CONFIRMADA",
            "fechaModificacion": "2026-11-02 09:03:40",
            "cliente": { "id": 2, "nombre": "Luis" },
            "total": 600
        },
        {
            "id": 1,
            "clienteId": 1,
            "fechaVenta": "2026-10-28 10:15:00",
            "estado": "CONFIRMADA",
            "fechaModificacion": "2026-11-02 09:03:40",
            "cliente": { "id": 1, "nombre": "Ana" },
            "total": 200
        }
    ]
};

const currency = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0
});
const body = document.querySelector("#table-body");
const path = "http://localhost:3001/api/v1/ventas";

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
        filtered = filteredBD || ventasBD.data;
    } catch (error) {
        // Al fallar la API, usa la lista local de arriba con los 8 registros
        filtered = ventasBD.data;
    }

    body.replaceChildren();

    filtered.forEach(venta => {
        const row = document.createElement("tr");
        [
            venta.cliente.nombre, 
            venta.fechaVenta, 
            venta.estado, 
            currency.format(venta.total)
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);
        });
        body.append(row);
    });
}

render();