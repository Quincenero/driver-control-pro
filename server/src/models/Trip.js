import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hora: String,
  plataforma: {
    type: String,
    enum: ['UberX', 'Didi', 'Taxi', 'Cabify', 'Otro'],
    required: true,
  },
  ruta: String,
  distancia: String,
  monto: {
    type: Number,
    required: true,
    min: 0,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  // Campos adicionales
  duracion: Number, // en minutos
  calificacion: Number,
}, {
  timestamps: true,
});

// Índice para consultas rápidas por usuario y fecha
tripSchema.index({ user: 1, fecha: -1 });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;