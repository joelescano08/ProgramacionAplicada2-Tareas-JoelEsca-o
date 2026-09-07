const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let habitos = [];
let nextId = 1;

const validarHabito = (req, res, next) => {
    if (!req.body.nombre || !req.body.meta) {
        return res.status(400).json({ error: "El nombre y la meta (número de días) son obligatorios" });
    }
    next();
};

app.post('/habitos', validarHabito, (req, res) => {
    const nuevo = { id: nextId++, nombre: req.body.nombre, meta: req.body.meta, registros: [] };
    habitos.push(nuevo);
    res.status(201).json(nuevo);
});

app.get('/habitos', (req, res) => res.json(habitos));

app.post('/habitos/:id/registrar', (req, res) => {
    const habito = habitos.find(h => h.id === parseInt(req.params.id));
    if (!habito) return res.status(404).json({ error: "Hábito no encontrado" });
    
    const hoy = new Date().toISOString().split('T')[0]; 
    
    const yaRegistrado = habito.registros.find(r => r.fecha === hoy);
    if (yaRegistrado) return res.status(400).json({ error: "Ya registraste este hábito el día de hoy" });
    
    habito.registros.push({ fecha: hoy, completado: true });
    
    habito.registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
    res.json({ mensaje: "Hábito registrado por hoy", habito });
});

app.get('/habitos/:id/estadisticas', (req, res) => {
    const habito = habitos.find(h => h.id === parseInt(req.params.id));
    if (!habito) return res.status(404).json({ error: "Hábito no encontrado" });
    
    let rachaActual = 0;
    let mejorRacha = 0;
    
    if (habito.registros.length > 0) {
        let rachaTemporal = 1;
        mejorRacha = 1;
        rachaActual = 1;
        for (let i = 1; i < habito.registros.length; i++) {
            const fechaAnterior = new Date(habito.registros[i-1].fecha);
            const fechaActual = new Date(habito.registros[i].fecha);
            const diffDias = (fechaActual - fechaAnterior) / (1000 * 60 * 60 * 24);
            
            if (diffDias === 1) { 
                rachaTemporal++;
                rachaActual = rachaTemporal;
            } else { 
                rachaTemporal = 1;
                rachaActual = 1;
            }
            if (rachaTemporal > mejorRacha) mejorRacha = rachaTemporal;
        }
        
        
        const hoy = new Date();
        const ultimaFecha = new Date(habito.registros[habito.registros.length - 1].fecha);
        const diasDesdeUltimo = Math.floor((hoy - ultimaFecha) / (1000 * 60 * 60 * 24));
        
        if (diasDesdeUltimo > 1) {
            rachaActual = 0;
        }
    }
    
    const cumplimientoDecimal = (habito.registros.length / habito.meta) * 100;
    
    res.json({ 
        habito: habito.nombre, 
        diasCompletados: habito.registros.length,
        meta: habito.meta,
        rachaActual, 
        mejorRacha, 
        porcentajeCumplimiento: `${cumplimientoDecimal.toFixed(1)}%` 
    });
});

app.delete('/habitos/:id', (req, res) => {
    const index = habitos.findIndex(h => h.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Hábito no encontrado" });
    habitos.splice(index, 1);
    res.json({ mensaje: "Hábito eliminado" });
});

app.listen(3000, () => console.log("API 5 (Hábitos) ejecutándose en el puerto 3000"));