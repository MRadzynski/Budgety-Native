import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import DrawerNavigator from './src/routes/Drawer/Drawer';

const App = () => {
  return <DrawerNavigator />;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    flex: 1,
    justifyContent: 'center'
  }
});

export default App;
