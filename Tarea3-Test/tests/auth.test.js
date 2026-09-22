import request from 'supertest';
import app from '../src/app.js';

describe('Rutas de Autenticación (/auth)', () => {
  
  it('debería registrar un usuario exitosamente', async () => {
    const res = await request(app)
      .post('/auth/registro')
      .send({
        nombre: 'Usuario Test',
        email: `test_${Date.now()}@test.com`,
        password: '123456',
        rol: 'usuario'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).not.toHaveProperty('password');
  });

  it('debería rechazar un email duplicado', async () => {
    const emailUnico = `duplicado_${Date.now()}@test.com`;
    
    await request(app).post('/auth/registro').send({
      nombre: 'User 1',
      email: emailUnico,
      password: '123456'
    });

    const res = await request(app).post('/auth/registro').send({
      nombre: 'User 2',
      email: emailUnico,
      password: '123456'
    });
    
    expect(res.status).toBe(400);
  });

  it('debería hacer login exitoso con credenciales correctas', async () => {
    const emailLogin = `login_${Date.now()}@test.com`;
    
    await request(app).post('/auth/registro').send({
      nombre: 'Login User',
      email: emailLogin,
      password: '123456'
    });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: emailLogin,
        password: '123456'
      });
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

});