export const validarProducto = (req, res, next) => {
  const { precio, cantidad } = req.body;
  if (precio !== undefined && precio < 0) {
    return res.status(400).json({ error: "El precio debe ser un valor positivo." });
  }
  if (cantidad !== undefined && cantidad < 0) {
    return res.status(400).json({ error: "La cantidad debe ser un valor positivo." });
  }
  next();
};

export const validarDescuento = (req, res, next) => {
  const { descuento } = req.body;
  if (descuento === undefined || descuento < 0 || descuento > 50) {
    return res.status(400).json({ error: "El descuento debe ser un valor entre 0 y 50." });
  }
  next();
};

export const validarEncuesta = (req, res, next) => {
  const { opciones } = req.body;
  if (!opciones || !Array.isArray(opciones) || opciones.length < 2) {
    return res.status(400).json({ error: "La encuesta debe tener al menos 2 opciones." });
  }
  next();
};
