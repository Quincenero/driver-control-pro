export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Duplicado (índice único)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ success: false, message: `El ${field} ya está en uso` });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
};