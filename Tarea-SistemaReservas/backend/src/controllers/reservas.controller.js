import db from '../db.js';

export const crearReserva = async (req, res) => {
  try {
    const { fecha, hora, servicioId } = req.body;
    const usuarioId = req.usuario.id;

    if (!fecha || !hora || !servicioId) {
      return res.status(400).json({ error: 'Todos los campos (fecha, hora, servicioId) son obligatorios.' });
    }

    const fechaReserva = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    if (fechaReserva < ahora) {
      return res.status(400).json({ error: 'No se puede reservar en una fecha o hora pasada.' });
    }

    const servicio = await db.servicio.findUnique({
      where: { id: Number(servicioId) },
    });

    if (!servicio) {
      return res.status(404).json({ error: 'El servicio no existe.' });
    }

    const nuevaReserva = await db.reserva.create({
      data: {
        fecha,
        hora,
        usuarioId,
        servicioId: Number(servicioId),
        estado: 'pendiente',
      },
      include: { servicio: true },
    });

    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reserva: ' + error.message });
  }
};

export const obtenerMisReservas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const reservas = await db.reserva.findMany({
      where: { usuarioId },
      include: { servicio: true },
      orderBy: { id: 'desc' },
    });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tus reservas: ' + error.message });
  }
};

export const obtenerTodasLasReservas = async (req, res) => {
  try {
    const reservas = await db.reserva.findMany({
      include: {
        servicio: true,
        usuario: { select: { id: true, nombre: true, email: true } },
      },
      orderBy: { id: 'desc' },
    });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas: ' + error.message });
  }
};

export const cambiarEstadoReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['pendiente', 'completada', 'cancelada'].includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido.' });
    }

    const reservaActualizada = await db.reserva.update({
      where: { id: Number(id) },
      data: { estado },
    });

    res.json(reservaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado: ' + error.message });
  }
};

export const cancelarMiReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const reserva = await db.reserva.findUnique({
      where: { id: Number(id) },
    });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada.' });
    }

    if (reserva.usuarioId !== usuarioId) {
      return res.status(403).json({ error: 'No tienes permiso para cancelar esta reserva.' });
    }

    const reservaCancelada = await db.reserva.update({
      where: { id: Number(id) },
      data: { estado: 'cancelada' },
    });

    res.json({ mensaje: 'Reserva cancelada correctamente', reserva: reservaCancelada });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar la reserva: ' + error.message });
  }
};