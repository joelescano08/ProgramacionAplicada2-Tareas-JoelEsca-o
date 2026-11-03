import db from '../db.js';

export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await db.usuario.findUnique({
      where: { id: req.usuario.id },
      select: { id: true, nombre: true, email: true, rol: true } 
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio.' });

    const usuarioActualizado = await db.usuario.update({
      where: { id: req.usuario.id },
      data: { nombre },
      select: { id: true, nombre: true, email: true, rol: true }
    });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};