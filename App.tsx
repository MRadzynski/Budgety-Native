import 'react-native-gesture-handler';
import { COLORS } from './src/styles/Colors';
import { StyleSheet, StatusBar, View } from 'react-native';
import { useState } from 'react';
import AppRouter from './src/routes/AppRouter/AppRouter';

const App = () => {
  const [isAuthed, setIsAuthed] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={`${COLORS.PRIMARY}`}
        barStyle="light-content"
        translucent={true}
      />
      <AppRouter isAuthed={isAuthed} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1
  }
});

export default App;
