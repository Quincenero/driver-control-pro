// Ejemplo básico de validación para registro y login
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' });
  }
  next();
};