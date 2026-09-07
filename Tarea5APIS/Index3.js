const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let inventario = [];
let nextId = 1;

const validarProducto = (req, res, next) => {
    if (!req.body.producto || req.body.stock === undefined) {
        return res.status(400).json({ error: "El nombre del producto y el stock son obligatorios" });
    }
    next();
};

app.get('/inventario', (req, res) => res.json(inventario));

app.post('/inventario', validarProducto, (req, res) => {
    const { producto, stock, stockMinimo = 5 } = req.body;
    const nuevo = { id: nextId++, producto, stock, stockMinimo };
    inventario.push(nuevo);
    res.status(201).json(nuevo);
});

app.post('/inventario/:id/entrada', (req, res) => {
    const item = inventario.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: "Producto no encontrado" });
    
    const { cantidad } = req.body;
    if (!cantidad || cantidad <= 0) return res.status(400).json({ error: "Cantidad a ingresar debe ser mayor a cero" });
    
    item.stock += cantidad;
    res.json({ mensaje: "Entrada registrada", item });
});

app.post('/inventario/:id/salida', (req, res) => {
    const item = inventario.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: "Producto no encontrado" });
    
    const { cantidad } = req.body;
    if (!cantidad || cantidad <= 0) return res.status(400).json({ error: "Cantidad inválida" });
    
    if (cantidad > item.stock) return res.status(400).json({ error: "Stock insuficiente para esta salida" });
    
    item.stock -= cantidad;
    res.json({ mensaje: "Salida registrada", item });
});

app.get('/inventario/alertas', (req, res) => {
    const alertas = inventario
        .filter(i => i.stock < i.stockMinimo)
        .map(i => ({
            producto: i.producto,
            stockActual: i.stock,
            minimoRequerido: i.stockMinimo,
            faltante: i.stockMinimo - i.stock 
        }));
    res.json(alertas);
});

app.listen(3000, () => console.log("API 3 (Inventario) ejecutándose en el puerto 3000"));