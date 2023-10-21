import { createStackNavigator } from '@react-navigation/stack';
import ExpensesIncomeScreen from '../../screens/ExpensesIncomeScreen/ExpensesIncomeScreen';

const Stack = createStackNavigator();

const ExpensesIncomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={ExpensesIncomeScreen}
        name="ExpensesIncomeScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ExpensesIncomeScreen}
        name="AddCategory"
        options={{ animationEnabled: false, headerShown: false }}
      />
      <Stack.Screen
        component={ExpensesIncomeScreen}
        name="AddExpense"
        options={{ animationEnabled: false, headerShown: false }}
      />
      <Stack.Screen
        component={ExpensesIncomeScreen}
        name="EditCategory"
        options={{ animationEnabled: false, headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ExpensesIncomeStack;
