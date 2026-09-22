import prisma from "../prisma.js";

export const obtenerProductos = async () => {
  return await prisma.producto.findMany();
};

export const crearProducto = async (data) => {
  // Regla: si el producto ya existe, sumar cantidad.
  // Buscamos si ya existe por nombre
  const existente = await prisma.producto.findFirst({
    where: { nombre: data.nombre }
  });

  if (existente) {
    return await prisma.producto.update({
      where: { id: existente.id },
      data: {
        cantidad: existente.cantidad + data.cantidad,
        precio: data.precio // actualizamos precio o lo mantenemos? Lo actualizamos por si acaso
      }
    });
  }

  return await prisma.producto.create({ data });
};

export const actualizarProducto = async (id, data) => {
  return await prisma.producto.update({
    where: { id },
    data
  });
};

export const eliminarProducto = async (id) => {
  return await prisma.producto.delete({
    where: { id }
  });
};

export const obtenerTotalCarrito = async () => {
  const productos = await prisma.producto.findMany();
  const total = productos.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0);
  return total;
};

export const aplicarDescuentoCarrito = async (descuentoPorcentaje) => {
  // Descuento máximo 50% (validado en middleware o aquí)
  if (descuentoPorcentaje > 50) {
    throw new Error("El descuento máximo permitido es del 50%.");
  }

  const productos = await prisma.producto.findMany();
  
  // Aplicamos descuento a cada producto
  const actualizados = await Promise.all(
    productos.map(p => 
      prisma.producto.update({
        where: { id: p.id },
        data: { precio: p.precio * (1 - (descuentoPorcentaje / 100)) }
      })
    )
  );

  return actualizados;
};
