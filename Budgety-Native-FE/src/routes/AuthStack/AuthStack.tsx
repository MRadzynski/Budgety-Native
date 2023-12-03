import { createStackNavigator } from '@react-navigation/stack';
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen/ForgotPasswordScreen';
import LoginScreen from '../../screens/LoginScreen/LoginScreen';
import ResetPasswordScreen from '../../screens/ResetPasswordScreen/ResetPasswordScreen';
import SignUpScreen from '../../screens/SignUpScreen/SignUpScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={LoginScreen}
        name="Login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={SignUpScreen}
        name="SignUp"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ForgotPasswordScreen}
        name="ForgotPassword"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ResetPasswordScreen}
        name="ResetPassword"
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
