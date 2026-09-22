import * as productosService from "../services/productos.service.js";

export const getProductos = async (req, res) => {
  try {
    const productos = await productosService.obtenerProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos." });
  }
};

export const postProducto = async (req, res) => {
  try {
    const data = req.body;
    const nuevo = await productosService.crearProducto(data);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const putProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const actualizado = await productosService.actualizarProducto(id, data);
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto." });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await productosService.eliminarProducto(id);
    res.json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto." });
  }
};

export const getTotal = async (req, res) => {
  try {
    const total = await productosService.obtenerTotalCarrito();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: "Error al calcular el total." });
  }
};

export const aplicarDescuento = async (req, res) => {
  try {
    const { descuento } = req.body; // porcentaje
    const productos = await productosService.aplicarDescuentoCarrito(descuento);
    res.json({ message: "Descuento aplicado", productos });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
