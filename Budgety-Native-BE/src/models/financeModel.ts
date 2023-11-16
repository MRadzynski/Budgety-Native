import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const expensesIncomeInnerLogsSchema = new Schema({
  amount: Number,
  date: Date
});

const expensesIncomeLogsSchema = new Schema({
  amount: Number,
  categoryId: String,
  date: Date
});

const expensesIncomeSchema = new Schema({
  amount: Number,
  bgColor: String,
  categoryName: String,
  icon: String,
  logs: [expensesIncomeInnerLogsSchema]
});

const historyLogExpenseIncome = new Schema({
  amount: Number,
  bgColor: String,
  categoryName: String
});

const historyLogsSchema = new Schema({
  date: String,
  expenses: [historyLogExpenseIncome],
  income: [historyLogExpenseIncome]
});

const financeSchema = new Schema({
  expenses: [
    {
      required: true,
      type: expensesIncomeSchema
    }
  ],
  expensesLogs: [
    {
      type: expensesIncomeLogsSchema
    }
  ],
  historyLogs: [
    {
      type: historyLogsSchema
    }
  ],
  income: [
    {
      required: true,
      type: expensesIncomeSchema
    }
  ],
  incomeLogs: [
    {
      type: expensesIncomeLogsSchema
    }
  ],
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

export default mongoose.model('Finance', financeSchema);
