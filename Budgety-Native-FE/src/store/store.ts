import { AnyAction, configureStore } from '@reduxjs/toolkit';
import expenseIncomeSlice, {
  IExpenseIncomeSlice
} from '../slices/expenseIncomeSlice';
import userSlice, { logout, UserSlice } from '../slices/userSlice';

interface IState {
  expensesIncome: IExpenseIncomeSlice;
  user: UserSlice;
}

const rootReducer = (state: IState | undefined, action: AnyAction) => {
  if (action.type === logout.type) state = undefined;

  return {
    expensesIncome: expenseIncomeSlice(state?.expensesIncome, action),
    user: userSlice(state?.user, action)
  };
};

export const store = configureStore({
  reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
