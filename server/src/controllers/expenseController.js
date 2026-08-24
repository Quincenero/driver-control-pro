import Expense from '../models/Expense.js';

// -------------------------------------------
// @desc    Obtener gastos del usuario
// @route   GET /api/expenses
// @query   periodo: 'hoy'|'semana'|'mes'
// -------------------------------------------
export const getExpenses = async (req, res, next) => {
  try {
    const { periodo } = req.query;
    let fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);

    if (periodo === 'semana') {
      fechaInicio.setDate(fechaInicio.getDate() - 7);
    } else if (periodo === 'mes') {
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    }

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: fechaInicio },
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------
// @desc    Crear un gasto
// @route   POST /api/expenses
// -------------------------------------------
export const createExpense = async (req, res, next) => {
  try {
    const { category, amount, description, date } = req.body;

    const expense = await Expense.create({
      user: req.user.id,
      category,
      amount,
      description,
      date: date || Date.now(),
    });

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------
// @desc    Obtener resumen de gastos (para el gráfico)
// @route   GET /api/expenses/summary
// -------------------------------------------
export const getExpenseSummary = async (req, res, next) => {
  try {
    const { periodo } = req.query;
    let fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);

    if (periodo === 'semana') {
      fechaInicio.setDate(fechaInicio.getDate() - 7);
    } else if (periodo === 'mes') {
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    }

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: fechaInicio },
    });

    // Agrupar por categoría
    const summary = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    // Transformar al formato que espera recharts: [{ name, value }]
    const result = Object.entries(summary).map(([name, value]) => ({
      name,
      value: Math.round(value), // o mantener decimales
    }));

    res.status(200).json({
      success: true,
      summary: result,
    });
  } catch (error) {
    next(error);
  }
};