import db from '../db.js';

export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await db.servicio.findMany();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};

export const crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, duracion, precio } = req.body;

    if (!nombre || !descripcion || !duracion || !precio) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoServicio = await db.servicio.create({
      data: {
        nombre,
        descripcion,
        duracion: parseInt(duracion), 
        precio: parseFloat(precio)   
      }
    });

    res.status(201).json({ message: 'Servicio creado exitosamente', servicio: nuevoServicio });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el servicio' });
  }
};


export const actualizarServicio = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, descripcion, duracion, precio } = req.body;

    const servicioActualizado = await db.servicio.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        duracion: duracion ? parseInt(duracion) : undefined,
        precio: precio ? parseFloat(precio) : undefined
      }
    });

    res.json({ message: 'Servicio actualizado', servicio: servicioActualizado });
  } catch (error) {

    res.status(500).json({ error: 'Error al actualizar el servicio o no encontrado' });
  }
};

export const eliminarServicio = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await db.servicio.delete({
      where: { id }
    });

    res.json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
};