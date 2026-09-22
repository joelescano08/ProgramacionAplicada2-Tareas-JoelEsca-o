import prisma from "../prisma.js";

export const obtenerInventario = async () => {
  return await prisma.inventario.findMany();
};

export const crearProductoInventario = async (data) => {
  return await prisma.inventario.create({ data });
};

export const registrarEntrada = async (id, cantidad) => {
  if (cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");
  
  return await prisma.inventario.update({
    where: { id },
    data: { stock: { increment: cantidad } }
  });
};

export const registrarSalida = async (id, cantidad) => {
  if (cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");

  const producto = await prisma.inventario.findUnique({ where: { id } });
  if (!producto) throw new Error("Producto no encontrado");

  if (producto.stock < cantidad) {
    throw new Error("Prohibido: la salida excede el stock disponible");
  }

  return await prisma.inventario.update({
    where: { id },
    data: { stock: { decrement: cantidad } }
  });
};

export const obtenerAlertas = async () => {
  const productos = await prisma.inventario.findMany();
  
  const alertas = productos
    .filter(p => p.stock <= p.stockMinimo)
    .map(p => ({
      ...p,
      faltanteParaMinimo: p.stockMinimo - p.stock,
      mensaje: p.stock === p.stockMinimo 
        ? "Stock al límite del mínimo" 
        : `Por debajo del mínimo. Faltan ${p.stockMinimo - p.stock} unidades para alcanzar el mínimo`
    }));

  return alertas;
};
