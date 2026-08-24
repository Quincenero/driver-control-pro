import express from 'express';
import { getExpenses, createExpense, getExpenseSummary } from '../controllers/expenseController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getExpenses)
  .post(protect, createExpense);

router.get('/summary', protect, getExpenseSummary);

export default router;