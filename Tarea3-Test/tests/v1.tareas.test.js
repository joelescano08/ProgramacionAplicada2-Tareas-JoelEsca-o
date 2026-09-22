import request from 'supertest';
import app from '../src/app.js';

const API_KEY = process.env.API_KEY || 'tu_api_key_secreta';

describe('Fase 1 - Rutas v1 (/v1/tareas)', () => {

  it('debería fallar si falta el título de la tarea', async () => {
    const res = await request(app)
      .post('/v1/tareas')
      .set('x-api-key', API_KEY)
      .send({
        usuarioId: 1
      });
      
    expect(res.status).toBe(400); 
  });

  it('debería crear una tarea exitosamente con API Key y usuarioId válido', async () => {
    const res = await request(app)
      .post('/v1/tareas')
      .set('x-api-key', API_KEY)
      .send({
        titulo: 'Prueba de Tarea v1',
        usuarioId: 1 // Asegúrate de que este ID exista en tu BD o usa uno dinámico
      });
      
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.titulo).toBe('Prueba de Tarea v1');
  });

  it('debería fallar si falta el título de la tarea', async () => {
    const res = await request(app)
      .post('/v1/tareas')
      .set('x-api-key', API_KEY)
      .send({
        usuarioId: 1
      });
      
    expect(res.status).toBe(400);
  });

});