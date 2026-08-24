import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'Máximo 50 caracteres'],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Máximo 50 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'Mínimo 6 caracteres'],
    select: false,
  },
  phone: {
    type: String,
    match: [/^\+?[0-9]{7,15}$/, 'Formato de teléfono inválido'],
  },
  birthDate: {
    type: Date,
  },
  // Campos adicionales que puedas necesitar
  vehicleModel: String,
  vehiclePlate: String,
  // ...
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

// 🔐 Hash de contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 📝 Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🎟️ Generar token de reseteo
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutos
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;