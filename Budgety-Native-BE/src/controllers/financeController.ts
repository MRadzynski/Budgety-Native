import mongoose from 'mongoose';
import { Request, Response } from 'express';
import FinanceModel from '../models/financeModel';
import { isTheSameMonthYear } from '../utils/finances';

interface IExpenseIncome {
  _id: mongoose.Types.ObjectId;
  amount: Number;
  bgColor: String;
  categoryName: String;
  icon: String;
  logs: {
    _id: mongoose.Types.ObjectId;
    amount: Number;
    date: Date;
  }[];
}

interface IExpensesIncomeLog {
  _id: mongoose.Types.ObjectId;
  amount: Number;
  categoryId: String;
  date: Date;
}

interface IHistoryLog {
  date: String;
  expenses: {
    amount: Number;
    bgColor: String;
    categoryName: String;
  }[];
  income: {
    amount: Number;
    bgColor: String;
    categoryName: String;
  }[];
}

interface IFinanceDocExp {
  expenses: IExpenseIncome[];
}

interface IFinanceDocExpInc {
  expenses: IExpenseIncome[];
  income: IExpenseIncome[];
}

interface IFinanceDocExpIncHistLog {
  expenses: IExpenseIncome[];
  historyLogs: IHistoryLog[];
  income: IExpenseIncome[];
}

interface IFinanceDocExpIncWithLogs {
  expenses: IExpenseIncome[];
  expensesLogs: IExpensesIncomeLog[];
  income: IExpenseIncome[];
  incomeLogs: IExpensesIncomeLog[];
}

interface IFinanceDocInc {
  income: IExpenseIncome[];
}

export interface IFinanceDocument {
  expenses: IExpenseIncome[];
  expensesLogs: IExpensesIncomeLog[];
  historyLogs: IHistoryLog[];
  income: IExpenseIncome[];
  incomeLogs: IExpensesIncomeLog[];
  save: () => Promise<IFinanceDocument>;
}

export const handleDeleteExpense = async (req: Request, res: Response) => {
  const { userId } = req;

  const { id } = req.body as { id: string };

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOne({
      userId: userId
    })) as IFinanceDocument;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    const foundExpense = financeDoc.expensesLogs.find(
      log => log._id.toString() === id
    );

    const expensesCategory = financeDoc.expenses.map(expense => {
      if (expense._id.toString() === foundExpense?.categoryId) {
        expense.amount = Number(expense.amount) - Number(foundExpense.amount);
        expense.logs = expense.logs.filter(log => log._id.toString() !== id);
      }

      return expense;
    });

    financeDoc.expenses = expensesCategory;
    financeDoc.expensesLogs = financeDoc.expensesLogs.filter(
      log => log._id.toString() !== id
    );

    const savedFinanceDoc = await financeDoc.save();

    if (!savedFinanceDoc)
      return res.status(404).json({ error: 'An error occurred' });

    const monthlyExpenses = savedFinanceDoc.expenses.map(expense => {
      const { _id, bgColor, categoryName, icon } = expense;

      const monthlyLogs = expense.logs.filter(log =>
        isTheSameMonthYear(log.date)
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

    res.status(200).json({
      monthlyExpenses
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handleDeleteExpensesCategory = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;

  const { id } = req.body as { id: string };

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOneAndUpdate(
      { userId: userId },
      { $pull: { expenses: { _id: id } } },
      { new: true }
    ).select('expenses')) as IFinanceDocExp;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    res.status(200).json({ expenses: financeDoc.expenses });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handleDeleteIncome = async (req: Request, res: Response) => {
  const { userId } = req;

  const { id } = req.body as { id: string };

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOne({
      userId: userId
    })) as IFinanceDocument;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    const foundIncome = financeDoc.incomeLogs.find(
      log => log._id.toString() === id
    );

    const incomeCategory = financeDoc.income.map(income => {
      if (income._id.toString() === foundIncome?.categoryId) {
        income.amount = Number(income.amount) - Number(foundIncome.amount);
        income.logs = income.logs.filter(log => log._id.toString() !== id);
      }

      return income;
    });

    financeDoc.income = incomeCategory;
    financeDoc.incomeLogs = financeDoc.incomeLogs.filter(
      log => log._id.toString() !== id
    );

    const savedFinanceDoc = await financeDoc.save();

    if (!savedFinanceDoc)
      return res.status(404).json({ error: 'An error occurred' });

    const monthlyIncome = savedFinanceDoc.income.map(income => {
      const { _id, bgColor, categoryName, icon } = income;

      const monthlyLogs = income.logs.filter(log =>
        isTheSameMonthYear(log.date)
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

    res.status(200).json({
      monthlyIncome
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handleDeleteIncomeCategory = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;

  const { id } = req.body as { id: string };

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOneAndUpdate(
      { userId: userId },
      { $pull: { income: { _id: id } } },
      { new: true }
    ).select('income')) as IFinanceDocInc;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    res.status(200).json({ income: financeDoc.income });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handleEraseAllData = async (req: Request, res: Response) => {
  const { userId } = req;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  const financeDoc = (await FinanceModel.findOne({
    userId: userId
  })) as IFinanceDocument;

  if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

  financeDoc.expenses = [];
  financeDoc.expensesLogs = [];
  financeDoc.historyLogs = [];
  financeDoc.income = [];
  financeDoc.incomeLogs = [];

  const savedFinanceDoc = await financeDoc.save();

  if (!savedFinanceDoc)
    return res.status(404).json({ error: 'An error occurred' });

  res.status(200).json({
    expenses: savedFinanceDoc.expenses,
    income: savedFinanceDoc.income
  });
};

export const handleGetBalance = async (req: Request, res: Response) => {
  const { userId } = req;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOne({ userId: userId }).select(
      'expenses expensesLogs income incomeLogs'
    )) as IFinanceDocExpIncWithLogs;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    const sumOfAllExpenses = financeDoc.expenses.reduce(
      (acc, expCategory) => (acc += Number(expCategory.amount)),
      0
    );

    const sumOfAllIncome = financeDoc.income.reduce(
      (acc, incCategory) => (acc += Number(incCategory.amount)),
      0
    );

    const sumOfMonthlyExpenses = financeDoc.expensesLogs.reduce(
      (acc, expLog) => {
        if (isTheSameMonthYear(expLog.date))
          return (acc += Number(expLog.amount));
        return acc;
      },
      0
    );

    const sumOfMonthlyIncome = financeDoc.incomeLogs.reduce((acc, incLog) => {
      if (isTheSameMonthYear(incLog.date))
        return (acc += Number(incLog.amount));
      return acc;
    }, 0);

    const allTimeBalance = sumOfAllIncome - sumOfAllExpenses;
    const monthlyBalance = sumOfMonthlyIncome - sumOfMonthlyExpenses;

    res.status(200).json({ allTimeBalance, monthlyBalance });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handleGetCategories = async (req: Request, res: Response) => {
  const { userId } = req;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOne({ userId: userId }).select(
      'expenses income'
    )) as IFinanceDocExpInc;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    res
      .status(200)
      .json({ expenses: financeDoc.expenses, income: financeDoc.income });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handleGetCategoriesMonthly = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOne({ userId: userId }).select(
      'expenses income'
    )) as IFinanceDocExpInc;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    const monthlyExpenses = financeDoc.expenses.map(expense => {
      const { _id, bgColor, categoryName, icon } = expense;

      const monthlyLogs = expense.logs.filter(log =>
        isTheSameMonthYear(log.date)
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
        isTheSameMonthYear(log.date)
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

    res.status(200).json({ monthlyExpenses, monthlyIncome });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handleGetExpensesCategories = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOne({ userId: userId }).select(
      'expenses'
    )) as IFinanceDocExp;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    res.status(200).json({ expenses: financeDoc.expenses });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handleGetHistoryCategories = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOne({ userId: userId }).select(
      'expenses historyLogs income '
    )) as IFinanceDocExpIncHistLog;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    const sumOfAllExpenses = financeDoc.expenses.reduce(
      (acc, expCategory) => (acc += Number(expCategory.amount)),
      0
    );

    const sumOfAllIncome = financeDoc.income.reduce(
      (acc, incCategory) => (acc += Number(incCategory.amount)),
      0
    );

    const preparedHistoryLogs = financeDoc.historyLogs.map(historyLog => {
      const sumOfExpenses = historyLog.expenses.reduce(
        (acc, expCategory) => (acc += Number(expCategory.amount)),
        0
      );

      const sumOfIncome = historyLog.income.reduce(
        (acc, incCategory) => (acc += Number(incCategory.amount)),
        0
      );

      return {
        date: historyLog.date,
        expenses: historyLog.expenses,
        income: historyLog.income,
        sumOfExpenses,
        sumOfIncome
      };
    });

    const history = [
      {
        date: 'All Time',
        expenses: financeDoc.expenses,
        income: financeDoc.income,
        sumOfExpenses: sumOfAllExpenses,
        sumOfIncome: sumOfAllIncome
      },
      ...preparedHistoryLogs
    ];

    res.status(200).json({ history });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handleGetIncomeCategories = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOne({ userId: userId }).select(
      'income'
    )) as IFinanceDocInc;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    res.status(200).json({ income: financeDoc.income });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handlePatchExpensesEditCategory = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;
  const { bgColor, categoryName, icon, id } = req.body as {
    bgColor: string;
    categoryName: string;
    icon: string;
    id: string;
  };

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          'expenses.$[elem].bgColor': bgColor,
          'expenses.$[elem].categoryName': categoryName,
          'expenses.$[elem].icon': icon
        }
      },
      { arrayFilters: [{ 'elem._id': id }], new: true }
    ).select('expenses')) as IFinanceDocExp;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    res.status(200).json({ expenses: financeDoc.expenses });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handlePatchIncomeEditCategory = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;
  const { bgColor, categoryName, icon, id } = req.body as {
    bgColor: string;
    categoryName: string;
    icon: string;
    id: string;
  };

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          'income.$[elem].bgColor': bgColor,
          'income.$[elem].categoryName': categoryName,
          'income.$[elem].icon': icon
        }
      },
      { arrayFilters: [{ 'elem._id': id }], new: true }
    ).select('income')) as IFinanceDocInc;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    res.status(200).json({ income: financeDoc.income });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handlePostExpensesAddCategory = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;
  const { bgColor, categoryName, icon } = req.body as {
    bgColor: string;
    categoryName: string;
    icon: string;
  };

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          expenses: { amount: 0, bgColor, categoryName, icon, logs: [] }
        }
      },
      { new: true }
    ).select('expenses')) as IFinanceDocExp;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    res.status(200).json({ expenses: financeDoc.expenses });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handlePostExpensesAddExpense = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;
  const { amount, id } = req.body as { amount: number; id: string };

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOne({
      userId: userId
    })) as IFinanceDocument;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    const expense = financeDoc.expenses.find(
      expense => expense._id.toString() === id
    );

    if (!expense) return res.status(404).json({ error: 'Data not found' });
    const newObjectId = new mongoose.Types.ObjectId();
    const logDate = new Date();

    expense.amount = Number(expense.amount) + Number(amount);
    expense.logs.push({ _id: newObjectId, amount, date: logDate });

    financeDoc.expensesLogs.push({
      _id: newObjectId,
      amount,
      categoryId: id,
      date: logDate
    });

    const savedFinanceDoc = await financeDoc.save();

    if (!savedFinanceDoc)
      return res.status(404).json({ error: 'An error occurred' });

    const monthlyExpenses = savedFinanceDoc.expenses.map(expense => {
      const { _id, bgColor, categoryName, icon } = expense;

      const monthlyLogs = expense.logs.filter(log =>
        isTheSameMonthYear(log.date)
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

    res
      .status(200)
      .json({ financeEntryId: newObjectId?.toString(), monthlyExpenses });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handlePostIncomeAddCategory = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;
  const { bgColor, categoryName, icon } = req.body as {
    bgColor: string;
    categoryName: string;
    icon: string;
  };

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          income: { amount: 0, bgColor, categoryName, icon, logs: [] }
        }
      },
      { new: true }
    ).select('income')) as IFinanceDocInc;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    res.status(200).json({ income: financeDoc.income });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const handlePostIncomeAddIncome = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;
  const { amount, id } = req.body as { amount: number; id: string };

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = (await FinanceModel.findOne({
      userId: userId
    })) as IFinanceDocument;

    if (!financeDoc) return res.status(404).json({ error: 'Data not found' });

    const income = financeDoc.income.find(
      income => income._id.toString() === id
    );

    if (!income) return res.status(404).json({ error: 'Data not found' });

    const newObjectId = new mongoose.Types.ObjectId();
    const logDate = new Date();

    income.amount = Number(income.amount) + Number(amount);
    income.logs.push({ _id: newObjectId, amount, date: logDate });

    financeDoc.incomeLogs.push({
      _id: newObjectId,
      amount,
      categoryId: id,
      date: logDate
    });

    const savedFinanceDoc = await financeDoc.save();

    if (!savedFinanceDoc)
      return res.status(404).json({ error: 'An error occurred' });

    const monthlyIncome = savedFinanceDoc.income.map(income => {
      const { _id, bgColor, categoryName, icon } = income;

      const monthlyLogs = income.logs.filter(log =>
        isTheSameMonthYear(log.date)
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

    res
      .status(200)
      .json({ financeEntryId: newObjectId?.toString(), monthlyIncome });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
