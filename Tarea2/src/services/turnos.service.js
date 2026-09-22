import prisma from "../prisma.js";

export const crearTurno = async (cliente, servicio) => {
  return await prisma.turno.create({
    data: { cliente, servicio, estado: "esperando" }
  });
};

export const obtenerTurnos = async () => {
  return await prisma.turno.findMany({
    orderBy: { id: 'asc' }
  });
};

export const obtenerSiguiente = async () => {
  // Retorna el próximo en espera (FIFO - ID más bajo)
  const turno = await prisma.turno.findFirst({
    where: { estado: "esperando" },
    orderBy: { id: "asc" }
  });
  return turno;
};

export const llamarTurno = async () => {
  // Verificar si hay alguno "atendiendo"
  const enAtencion = await prisma.turno.findFirst({
    where: { estado: "atendiendo" }
  });

  if (enAtencion) {
    throw new Error("No se puede llamar al siguiente, hay un turno siendo atendido actualmente.");
  }

  // Buscar el siguiente en espera (FIFO)
  const siguiente = await obtenerSiguiente();
  if (!siguiente) {
    throw new Error("No hay turnos en espera.");
  }

  // Cambiar estado a "atendiendo"
  return await prisma.turno.update({
    where: { id: siguiente.id },
    data: { estado: "atendiendo" }
  });
};

export const finalizarTurno = async (id) => {
  const turno = await prisma.turno.findUnique({ where: { id } });
  if (!turno) throw new Error("Turno no encontrado.");

  if (turno.estado !== "atendiendo") {
    throw new Error("Solo se puede finalizar un turno que esté siendo atendido.");
  }

  return await prisma.turno.update({
    where: { id },
    data: { estado: "finalizado" }
  });
};

export const obtenerTurnosEnEspera = async () => {
  return await prisma.turno.findMany({
    where: { estado: "esperando" },
    orderBy: { id: "asc" }
  });
};
