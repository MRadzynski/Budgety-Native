import express from 'express';
import { authChecker } from '../middlewares/authChecker';
import {
  handleDeleteExpensesCategory,
  handleDeleteIncomeCategory,
  handleGetBalance,
  handleGetCategories,
  handleGetCategoriesMonthly,
  handleGetExpensesCategories,
  handleGetHistoryCategories,
  handleGetIncomeCategories,
  handlePatchExpensesEditCategory,
  handlePatchIncomeEditCategory,
  handlePostExpensesAddCategory,
  handlePostExpensesAddExpense,
  handlePostIncomeAddCategory,
  handlePostIncomeAddIncome
} from '../controllers/financeController';

const router = express.Router();

router.use(authChecker);

router.delete('/expenses/delete-category', handleDeleteExpensesCategory);

router.delete('/income/delete-category', handleDeleteIncomeCategory);

router.get('/get-balance', handleGetBalance);

router.get('/get-categories', handleGetCategories);

router.get('/get-categories-history', handleGetHistoryCategories);

router.get('/get-categories-monthly', handleGetCategoriesMonthly);

router.get('/expenses/get-categories', handleGetExpensesCategories);

router.get('/income/get-categories', handleGetIncomeCategories);

router.patch('/expenses/edit-category', handlePatchExpensesEditCategory);

router.patch('/income/edit-category', handlePatchIncomeEditCategory);

router.post('/expenses/add-category', handlePostExpensesAddCategory);

router.post('/expenses/add-expense', handlePostExpensesAddExpense);

router.post('/income/add-category', handlePostIncomeAddCategory);

router.post('/income/add-income', handlePostIncomeAddIncome);

export default router;
