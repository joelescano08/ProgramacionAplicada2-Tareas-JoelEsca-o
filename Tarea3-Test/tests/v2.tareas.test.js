import request from 'supertest';
import app from '../src/app.js';

describe('Fase 2 - Rutas v2 con JWT y Roles (/v2/tareas)', () => {
  let tokenUsuario = '';

  beforeAll(async () => {
    const emailUser = `v2_user_${Date.now()}@test.com`;
    await request(app).post('/auth/registro').send({
      nombre: 'User V2',
      email: emailUser,
      password: '123456',
      rol: 'usuario'
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: emailUser,
      password: '123456'
    });

    tokenUsuario = loginRes.body.token;
  });

  it('debería retornar 401 si no se envía el token Bearer', async () => {
    const res = await request(app).get('/v2/tareas');
    expect(res.status).toBe(401);
  });

  it('debería retornar 200 y las tareas del usuario autenticado', async () => {
    const res = await request(app)
      .get('/v2/tareas')
      .set('Authorization', `Bearer ${tokenUsuario}`);
      
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});