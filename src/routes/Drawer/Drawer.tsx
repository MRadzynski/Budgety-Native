import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CustomDrawerContent from '../CustomDrawerContent/CustomDrawerContent';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ExpensesIncomeScreen from '../../screens/ExpensesIncomeScreen/ExpensesIncomeScreen';
import ExchangeScreen from '../../screens/ExchangeScreen/ExchangeScreen';
import HistoryScreen from '../../screens/HistoryScreen/HistoryScreen';
import SettingsScreen from '../../screens/SettingsScreen/SettingsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => (
  <NavigationContainer>
    <Drawer.Navigator
      drawerContent={({ navigation }) => (
        <CustomDrawerContent navigation={navigation} />
      )}
      initialRouteName="Home"
    >
      <Drawer.Screen component={HomeScreen} name="Home" />
      <Drawer.Screen component={ExpensesIncomeScreen} name="ExpensesIncome" />
      <Drawer.Screen component={ExchangeScreen} name="Exchange" />
      <Drawer.Screen component={HistoryScreen} name="History" />
      <Drawer.Screen component={SettingsScreen} name="Settings" />
    </Drawer.Navigator>
  </NavigationContainer>
);

export default DrawerNavigator;
