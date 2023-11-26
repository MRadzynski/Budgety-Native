import 'react-native-gesture-handler';
import { COLORS } from './src/styles/Colors';
import { Provider } from 'react-redux';
import { StatusBar, StyleSheet, View } from 'react-native';
import { store } from './src/store/store';
import AppRouter from './src/routes/AppRouter/AppRouter';
import Toast, { BaseToastProps, ErrorToast } from 'react-native-toast-message';

type TCustomProps = {
  props: {
    text1FontSize?: number;
  };
};

const toastConfig = {
  error: (props: BaseToastProps & TCustomProps) => (
    <ErrorToast
      {...props}
      contentContainerStyle={{
        //backgroundColor: COLORS.ERROR,
        backgroundColor: '#F15455',
        borderRadius: 8,
        margin: 0,
        padding: 0
      }}
      style={{
        borderLeftWidth: 0,
        borderRadius: 12
      }}
      text1Style={{
        color: COLORS.WHITE_SHADE,
        fontSize: props?.props?.text1FontSize || 17
      }}
      text2Style={{
        color: COLORS.WHITE_SHADE
      }}
    />
  )
};

const App = () => (
  <Provider store={store}>
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
      <AppRouter />
      <Toast config={toastConfig} />
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
