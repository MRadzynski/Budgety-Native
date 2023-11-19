import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IExpensesIncomeCategory {
  _id: string;
  amount: number;
  bgColor: string;
  categoryName: string;
  icon: string;
}

export interface IExpenseIncomeSlice {
  context: 'EXPENSES' | 'INCOME';
  expensesCategories: IExpensesIncomeCategory[];
  incomeCategories: IExpensesIncomeCategory[];
}

const initialState: IExpenseIncomeSlice = {
  context: 'EXPENSES',
  expensesCategories: [],
  incomeCategories: []
};

const expenseIncomeSlice = createSlice({
  initialState,
  name: 'expenseIncome',
  reducers: {
    setContext(state, action: PayloadAction<any>) {
      state.context = action.payload;
    },
    setExpensesCategories(state, action: PayloadAction<any>) {
      state.expensesCategories = action.payload;
    },
    setIncomeCategories(state, action: PayloadAction<any>) {
      state.incomeCategories = action.payload;
    }
  }
});

export const { setContext, setExpensesCategories, setIncomeCategories } =
  expenseIncomeSlice.actions;
export default expenseIncomeSlice.reducer;
