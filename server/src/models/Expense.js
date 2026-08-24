import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['Combustible', 'Comisión App', 'Limpieza', 'Mantenimiento', 'Otro'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

expenseSchema.index({ user: 1, date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;