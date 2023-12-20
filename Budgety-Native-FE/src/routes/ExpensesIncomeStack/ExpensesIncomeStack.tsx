import { createStackNavigator } from '@react-navigation/stack';
import CategoryForm from '../../components/CategoryForm/CategoryForm';
import CategoryRoute from '../../components/CategoryList/CategoryList';
import ExpenseIncomeForm from '../../components/ExpenseIncomeForm/ExpenseIncomeForm';

const Stack = createStackNavigator();

const ExpensesIncomeStack = () => (
  <Stack.Navigator initialRouteName="CategoriesList">
    <Stack.Screen
      component={CategoryForm}
      name="AddCategory"
      options={{ animationEnabled: false, headerShown: false }}
    />
    <Stack.Screen
      component={ExpenseIncomeForm}
      name="AddExpenseIncome"
      options={{
        animationEnabled: false,
        headerShown: false
      }}
    />
    <Stack.Screen
      component={CategoryRoute}
      name="CategoriesList"
      options={{ animationEnabled: false, headerShown: false }}
    />
    <Stack.Screen
      component={CategoryForm}
      name="EditCategory"
      options={{ animationEnabled: false, headerShown: false }}
    />
  </Stack.Navigator>
);

export default ExpensesIncomeStack;
