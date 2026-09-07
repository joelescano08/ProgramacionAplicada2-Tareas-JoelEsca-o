const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let productos = [];
let nextId = 1;

const validarProducto = (req, res, next) => {
    const { nombre, precio, cantidad } = req.body;
    
    if (!nombre || precio === undefined || cantidad === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios: nombre, precio, cantidad." });
    }
    if (precio <= 0 || cantidad <= 0) {
        return res.status(400).json({ error: "El precio y cantidad deben ser números positivos mayores a 0." });
    }
    next();
};

app.get('/productos', (req, res) => {
    res.json(productos);
});

app.post('/productos', validarProducto, (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    
    const productoExistente = productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    
    if (productoExistente) {
        productoExistente.cantidad += cantidad; 
        return res.json({ 
            mensaje: "El producto ya existía. Se ha sumado la cantidad.", 
            producto: productoExistente 
        });
    }
    
    const nuevoProducto = { id: nextId++, nombre, precio, cantidad };
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

app.put('/productos/:id', (req, res) => {
    const idParam = parseInt(req.params.id);
    const { cantidad } = req.body;

    const producto = productos.find(p => p.id === idParam);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado." });
    
    if (cantidad === undefined || cantidad <= 0) {
        return res.status(400).json({ error: "Debe enviar una cantidad positiva." });
    }
    
    producto.cantidad = cantidad;
    res.json({ mensaje: "Cantidad actualizada", producto });
});

app.delete('/productos/:id', (req, res) => {
    const idParam = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === idParam);
    
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado." });
    
    productos.splice(index, 1);
    res.json({ mensaje: "Producto eliminado correctamente." });
});

app.get('/carrito/total', (req, res) => {
    const total = productos.reduce((acumulador, prod) => acumulador + (prod.precio * prod.cantidad), 0);
    res.json({ total });
});

app.post('/carrito/aplicar-descuento', (req, res) => {
    const { porcentaje } = req.body;
    
    if (porcentaje === undefined || porcentaje < 0 || porcentaje > 50) {
        return res.status(400).json({ error: "El descuento debe estar entre 0 y 50%." });
    }
    
    const totalBruto = productos.reduce((acumulador, prod) => acumulador + (prod.precio * prod.cantidad), 0);
    const descuentoEnDinero = totalBruto * (porcentaje / 100);
    const totalFinal = totalBruto - descuentoEnDinero;
    
    res.json({ 
        totalBruto, 
        descuentoAplicado: `${porcentaje}%`, 
        totalFinal 
    });
});

app.listen(3000, () => console.log("API 1 corriendo en el puerto 3000"));