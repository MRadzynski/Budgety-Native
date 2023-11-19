import { AnyAction, configureStore } from '@reduxjs/toolkit';
import expenseIncomeSlice, {
  IExpenseIncomeSlice
} from '../slices/expenseIncomeSlice';
import settingsSlice, { SettingsState } from '../slices/settingsSlice';
import userSlice, { UserSlice, logout } from '../slices/userSlice';

interface IState {
  expensesIncome: IExpenseIncomeSlice;
  settings: SettingsState;
  user: UserSlice;
}

const rootReducer = (state: IState | undefined, action: AnyAction) => {
  if (action.type === logout.type) {
    state = undefined;
  }
  console.log('state', state);
  return {
    expensesIncome: expenseIncomeSlice(state?.expensesIncome, action),
    settings: settingsSlice(state?.settings, action),
    user: userSlice(state?.user, action)
  };
};

export const store = configureStore({
  reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
