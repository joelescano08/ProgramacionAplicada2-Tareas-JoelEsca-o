import * as inventarioService from "../services/inventario.service.js";

export const getInventario = async (req, res) => {
  try {
    const inventario = await inventarioService.obtenerInventario();
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el inventario." });
  }
};

export const postInventario = async (req, res) => {
  try {
    const data = req.body;
    const nuevo = await inventarioService.crearProductoInventario(data);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto en inventario." });
  }
};

export const postEntrada = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;
    const actualizado = await inventarioService.registrarEntrada(id, cantidad);
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const postSalida = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;
    const actualizado = await inventarioService.registrarSalida(id, cantidad);
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAlertas = async (req, res) => {
  try {
    const alertas = await inventarioService.obtenerAlertas();
    res.json(alertas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener alertas." });
  }
};
