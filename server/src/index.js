import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();
connectDB();

const app = express();

// Middlewares de seguridad y utilidad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 DriverControl API funcionando');
});

// Manejo de errores (siempre al final)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});