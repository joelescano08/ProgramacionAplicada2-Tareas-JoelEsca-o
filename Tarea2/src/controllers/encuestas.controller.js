import * as encuestasService from "../services/encuestas.service.js";

export const getEncuestas = async (req, res) => {
  try {
    const encuestas = await encuestasService.obtenerEncuestas();
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener encuestas." });
  }
};

export const postEncuesta = async (req, res) => {
  try {
    const { pregunta, opciones } = req.body;
    const nueva = await encuestasService.crearEncuesta(pregunta, opciones);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la encuesta." });
  }
};

export const postVotar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { opcionId } = req.body;
    await encuestasService.votar(id, opcionId);
    res.json({ message: "Voto registrado con éxito." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getResultados = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultados = await encuestasService.obtenerResultados(id);
    res.json(resultados);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteEncuesta = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await encuestasService.eliminarEncuesta(id);
    res.json({ message: "Encuesta eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la encuesta." });
  }
};
