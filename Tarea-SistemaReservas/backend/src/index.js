import express from 'express';
import dotenv from 'dotenv';
import db from './db.js';
import authRoutes from './routes/auth.routes.js';
import servicioRoutes from './routes/servicio.routes.js';
import reservasRoutes from './routes/reservas.routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/servicios', servicioRoutes);
app.use('/reservas', reservasRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API de Reservas funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});