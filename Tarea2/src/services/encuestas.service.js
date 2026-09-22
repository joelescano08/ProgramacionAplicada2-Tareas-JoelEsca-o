import prisma from "../prisma.js";

export const crearEncuesta = async (pregunta, opciones) => {
  return await prisma.encuesta.create({
    data: {
      pregunta,
      opciones: {
        create: opciones.map(o => ({ texto: o }))
      }
    },
    include: { opciones: true }
  });
};

export const obtenerEncuestas = async () => {
  return await prisma.encuesta.findMany({
    include: { opciones: true }
  });
};

export const votar = async (encuestaId, opcionId) => {
  // Verificar que la opción pertenece a la encuesta
  const opcion = await prisma.opcion.findFirst({
    where: { id: opcionId, encuestaId }
  });

  if (!opcion) {
    throw new Error("Opción no válida para esta encuesta.");
  }

  return await prisma.opcion.update({
    where: { id: opcionId },
    data: { votos: { increment: 1 } }
  });
};

export const obtenerResultados = async (encuestaId) => {
  const encuesta = await prisma.encuesta.findUnique({
    where: { id: encuestaId },
    include: { opciones: true }
  });

  if (!encuesta) {
    throw new Error("Encuesta no encontrada.");
  }

  const totalVotos = encuesta.opciones.reduce((acc, opt) => acc + opt.votos, 0);
  
  let ganadora = null;
  let maxVotos = -1;

  const resultados = encuesta.opciones.map(opt => {
    if (opt.votos > maxVotos) {
      maxVotos = opt.votos;
      ganadora = opt.texto;
    }
    return {
      texto: opt.texto,
      votos: opt.votos,
      porcentaje: totalVotos === 0 ? 0 : ((opt.votos / totalVotos) * 100).toFixed(2) + "%"
    };
  });

  return {
    pregunta: encuesta.pregunta,
    totalVotos,
    ganadora: totalVotos === 0 ? "Sin votos aún" : ganadora,
    resultados
  };
};

export const eliminarEncuesta = async (id) => {
  return await prisma.encuesta.delete({
    where: { id }
  });
};
