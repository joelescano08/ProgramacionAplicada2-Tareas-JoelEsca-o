const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let encuestas = [];
let nextId = 1;

const validarEncuesta = (req, res, next) => {
    const { pregunta, opciones } = req.body;
    if (!pregunta || !opciones || !Array.isArray(opciones)) {
        return res.status(400).json({ error: "Pregunta y opciones (como arreglo) son requeridas" });
    }
    if (opciones.length < 2) {
        return res.status(400).json({ error: "Se requieren mínimo 2 opciones para crear la encuesta" });
    }
    next();
};

app.post('/encuestas', validarEncuesta, (req, res) => {
    const { pregunta, opciones } = req.body;
    const opcionesEstructuradas = opciones.map(op => ({ nombre: op, votos: 0 }));
    
    const nuevaEncuesta = { id: nextId++, pregunta, opciones: opcionesEstructuradas };
    encuestas.push(nuevaEncuesta);
    res.status(201).json(nuevaEncuesta);
});

app.get('/encuestas', (req, res) => res.json(encuestas));

app.post('/encuestas/:id/votar', (req, res) => {
    const encuesta = encuestas.find(e => e.id === parseInt(req.params.id));
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });
    
    const { opcion } = req.body;
    const opcionAfectada = encuesta.opciones.find(o => o.nombre === opcion);
    if (!opcionAfectada) return res.status(400).json({ error: "La opción no existe en esta encuesta" });
    
    opcionAfectada.votos++;
    res.json({ mensaje: "Voto registrado exitosamente", encuesta });
});

app.get('/encuestas/:id/resultados', (req, res) => {
    const encuesta = encuestas.find(e => e.id === parseInt(req.params.id));
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });
    
    const totalVotos = encuesta.opciones.reduce((sum, op) => sum + op.votos, 0);
    let ganador = null;
    let maxVotos = -1;
    
    const resultados = encuesta.opciones.map(op => {
        if (op.votos > maxVotos) {
            maxVotos = op.votos;
            ganador = op.nombre;
        }
        return {
            opcion: op.nombre,
            votos: op.votos,
            porcentaje: totalVotos === 0 ? "0%" : ((op.votos / totalVotos) * 100).toFixed(2) + '%'
        };
    });
    
    res.json({ 
        totalVotos, 
        ganador: totalVotos === 0 ? "Sin votos aún" : ganador, 
        resultados 
    });
});

app.delete('/encuestas/:id', (req, res) => {
    const index = encuestas.findIndex(e => e.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Encuesta no encontrada" });
    encuestas.splice(index, 1);
    res.json({ mensaje: "Encuesta eliminada" });
});

app.listen(3000, () => console.log("API 2 (Votación) ejecutándose en el puerto 3000"));