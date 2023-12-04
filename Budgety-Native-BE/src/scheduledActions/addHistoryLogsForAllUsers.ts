import mongoose from 'mongoose';
import Finance from '../models/financeModel';
import User from '../models/userModel';
import { IFinanceDocument } from '../controllers/financeController';

const isTheSameMonthYearAsProvided = (
  dateToCheck: Date,
  month: number,
  year: number
) => dateToCheck.getFullYear() === year && dateToCheck.getMonth() === month;

const getPreviousMonthAndYear = () => {
  const currentDate = new Date();

  const previousMonth =
    currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;

  const previousYear =
    currentDate.getMonth() === 0
      ? currentDate.getFullYear() - 1
      : currentDate.getFullYear();

  return { previousMonth: previousMonth, previousYear: previousYear };
};

export const addHistoryLogsForAllUsers = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI!);
  }

  const usersDocs = await User.find();

  for (const userDoc of usersDocs) {
    const financeDoc = (await Finance.findOne({
      userId: userDoc._id
    })) as IFinanceDocument;

    if (financeDoc) {
      const { previousMonth, previousYear } = getPreviousMonthAndYear();

      const monthlyExpenses = financeDoc.expenses.map(expense => {
        const { _id, bgColor, categoryName, icon } = expense;

        const monthlyLogs = expense.logs.filter(log =>
          isTheSameMonthYearAsProvided(log.date, previousMonth, previousYear)
        );

        const monthlyAmount = monthlyLogs.reduce(
          (acc, log) => (acc += Number(log.amount)),
          0
        );

        return {
          _id,
          amount: monthlyAmount,
          bgColor,
          categoryName,
          icon
        };
      });

      const monthlyIncome = financeDoc.income.map(income => {
        const { _id, bgColor, categoryName, icon } = income;

        const monthlyLogs = income.logs.filter(log =>
          isTheSameMonthYearAsProvided(log.date, previousMonth, previousYear)
        );

        const monthlyAmount = monthlyLogs.reduce(
          (acc, log) => (acc += Number(log.amount)),
          0
        );

        return {
          _id,
          amount: monthlyAmount,
          bgColor,
          categoryName,
          icon
        };
      });

      const sumOfExpenses = monthlyExpenses
        .map(expense => expense.amount)
        .reduce((acc, amount) => (acc += amount), 0);

      const sumOfIncome = monthlyIncome
        .map(income => income.amount)
        .reduce((acc, amount) => (acc += amount), 0);

      const newRecord = {
        date: `${previousMonth + 1}/${previousYear}`,
        expenses: monthlyExpenses,
        income: monthlyIncome,
        sumOfExpenses: sumOfExpenses,
        sumOfIncome: sumOfIncome
      };

      financeDoc.historyLogs.unshift(newRecord);

      await financeDoc.save();
    }
  }

  console.log('New records added to historyLogs for all users');
};
