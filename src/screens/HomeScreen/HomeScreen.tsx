import { COLORS } from '../../styles/Colors';
import { StyleSheet, Text, View } from 'react-native';

interface DrawerProps {
  navigation: any;
}

const TEMP_BALANCE = 123.45;

const HomeScreen = ({ navigation }: DrawerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hey User! 👋</Text>
      <View style={styles.section}>
        <View style={styles.chartContainer}></View>
        <Text style={styles.balanceText}>{`Balance: $${TEMP_BALANCE}`}</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.chartContainer}></View>
        <Text style={styles.sectionValueText}>Income</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.chartContainer}></View>
        <Text style={styles.sectionValueText}>Expenses</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceText: {
    color: TEMP_BALANCE > 0 ? COLORS.SUCCESS : COLORS.ERROR,
    flex: 2,
    fontSize: 24,
    textAlign: 'center'
  },
  chartContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 8
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    gap: 32,
    paddingBottom: 32,
    paddingHorizontal: 32
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
    flex: 1,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 4 },
    shadowRadius: 5,
    width: '100%'
  },
  sectionValueText: {
    color: COLORS.BLACK_SHADE,
    flex: 2,
    fontSize: 20,
    textAlign: 'center'
  },
  welcomeText: {
    alignSelf: 'flex-start',
    color: COLORS.WHITE_SHADE,
    fontSize: 32,
    marginLeft: 24,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 3
  }
});

export default HomeScreen;
