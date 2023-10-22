import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { StatusBar, StyleSheet, View } from 'react-native';
import { store } from './src/store/store';
import AppRouter from './src/routes/AppRouter/AppRouter';

const App = () => (
  <Provider store={store}>
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
      <AppRouter />
    </View>
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1
  }
});

export default App;
