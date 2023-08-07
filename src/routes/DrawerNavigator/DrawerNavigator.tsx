import { COLORS } from '../../styles/Colors';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../CustomDrawerContent/CustomDrawerContent';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ExpensesIncomeScreen from '../../screens/ExpensesIncomeScreen/ExpensesIncomeScreen';
import ExchangeScreen from '../../screens/ExchangeScreen/ExchangeScreen';
import HistoryScreen from '../../screens/HistoryScreen/HistoryScreen';
import SettingsScreen from '../../screens/SettingsScreen/SettingsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => (
  <Drawer.Navigator
    drawerContent={({ navigation }) => (
      <CustomDrawerContent navigation={navigation} />
    )}
    initialRouteName="Home"
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.PRIMARY,
        shadowColor: 'transparent'
      },
      headerTintColor: COLORS.WHITE_SHADE,
      headerTitle: ''
    }}
  >
    <Drawer.Screen component={HomeScreen} name="Home" />
    <Drawer.Screen component={ExpensesIncomeScreen} name="ExpensesIncome" />
    <Drawer.Screen component={ExchangeScreen} name="Exchange" />
    <Drawer.Screen component={HistoryScreen} name="History" />
    <Drawer.Screen component={SettingsScreen} name="Settings" />
  </Drawer.Navigator>
);

export default DrawerNavigator;
