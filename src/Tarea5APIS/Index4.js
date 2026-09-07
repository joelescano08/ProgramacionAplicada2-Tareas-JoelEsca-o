const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let turnos = [];
let nextId = 1;

const validarTurno = (req, res, next) => {
    if (!req.body.cliente || !req.body.servicio) {
        return res.status(400).json({ error: "El nombre del cliente y servicio son obligatorios" });
    }
    next();
};

app.post('/turnos', validarTurno, (req, res) => {
    const nuevo = { 
        id: nextId++, 
        cliente: req.body.cliente, 
        servicio: req.body.servicio, 
        estado: 'esperando' 
    };
    turnos.push(nuevo);
    res.status(201).json(nuevo);
});

app.get('/turnos', (req, res) => res.json(turnos));

app.get('/turnos/siguiente', (req, res) => {
    const siguiente = turnos.find(t => t.estado === 'esperando');
    if (!siguiente) return res.json({ mensaje: "No hay nadie en espera" });
    res.json(siguiente);
});

app.put('/turnos/llamar', (req, res) => {
    const siendoAtendido = turnos.find(t => t.estado === 'atendiendo');
    if (siendoAtendido) {
        return res.status(400).json({ error: "Ya hay alguien siendo atendido. Finaliza ese turno primero." });
    }
    
    const siguiente = turnos.find(t => t.estado === 'esperando');
    if (!siguiente) return res.status(404).json({ error: "No hay turnos en cola" });
    
    siguiente.estado = 'atendiendo';
    res.json({ mensaje: "Llamando cliente", turno: siguiente });
});

app.put('/turnos/:id/finalizar', (req, res) => {
    const turno = turnos.find(t => t.id === parseInt(req.params.id));
    if (!turno) return res.status(404).json({ error: "Turno no encontrado" });
    if (turno.estado !== 'atendiendo') return res.status(400).json({ error: "Solo puedes finalizar un turno que esté siendo 'atendiendo'" });
    
    turno.estado = 'finalizado';
    res.json({ mensaje: "Turno finalizado con éxito", turno });
});

app.get('/turnos/espera', (req, res) => {
    const total = turnos.filter(t => t.estado === 'esperando').length;
    res.json({ totalEnEspera: total });
});

app.listen(3000, () => console.log("API 4 (Turnos) ejecutándose en el puerto 3000"));