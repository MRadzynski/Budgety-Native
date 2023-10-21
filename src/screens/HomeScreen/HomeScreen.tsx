import { COLORS } from '../../styles/Colors';
import { PieChartSelectEvent } from 'react-native-charts-wrapper';
import { StyleSheet, Text, View } from 'react-native';
import ScrollableBarChart from '../../components/ScrollableBarChart/ScrollableBarChart';
import SemiPieChart from '../../components/SemiPieChart/SemiPieChart';

interface DrawerProps {
  navigation: any;
}

const BALANCE_MOCK_DATA = [
  { color: '#4BB543', name: 'Expenses', value: 6248 },
  { color: '#ED4337', name: 'Income', value: 3752 }
];

const EXPENSES_MOCK_DATA = [
  {
    color: '#497E76',
    name: 'Food',
    value: 12.67
  },
  {
    color: '#6D3F5B',
    name: 'Bills',
    value: 22.32
  },
  {
    color: '#E6D690',
    name: 'Water',
    value: 54.3
  },
  {
    color: '#D95030',
    name: 'Clothes',
    value: 7.67
  },
  {
    color: '#FF7514',
    name: 'Electricity',
    value: 32.67
  },
  {
    color: '#FE0000',
    name: 'Gifts',
    value: 13.67
  },
  {
    color: '#A18594',
    name: 'Work',
    value: 4.67
  },
  {
    color: '#FAD201',
    name: 'Entertainment',
    value: 9.67
  },
  {
    color: '#3B83BD',
    name: 'Gas',
    value: 31.67
  },
  {
    color: '#DE4C8A',
    name: 'Family',
    value: 17.67
  }
];

const INCOME_MOCK_DATA = [
  {
    color: '#354D73',
    name: 'Job',
    value: 15.67
  },
  {
    color: '#1C542D',
    name: 'Additional Job',
    value: 17.32
  },
  {
    color: '#A2231D',
    name: 'Gifts',
    value: 33.3
  },
  {
    color: '#CDA434',
    name: 'Sales',
    value: 7.67
  },
  {
    color: '#2C5545',
    name: 'Charity',
    value: 32.67
  },
  {
    color: '#256D7B',
    name: 'Consulting',
    value: 23.67
  },
  {
    color: '#E63244',
    name: 'Rewards',
    value: 10.43
  }
];

const TEMP_BALANCE = 12322.45;

const HomeScreen = ({ navigation }: DrawerProps) => {
  const handleSemiPieChartClick = (event: PieChartSelectEvent) => {
    if (!event.nativeEvent || !event.nativeEvent.label) return;
    const context = event.nativeEvent.label;

    //TODO: navigate to the proper tab with context ^
    navigation.navigate('ExpensesIncome', {
      screen: 'ExpensesIncomeScreen'
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hey User! 👋</Text>
      <View style={styles.section}>
        <View style={styles.chartContainer}>
          <SemiPieChart
            chartStyles={styles.chart}
            data={BALANCE_MOCK_DATA}
            label="Balance"
            onSelectHandler={handleSemiPieChartClick}
          />
        </View>
        <Text style={styles.balanceText}>{`Balance: $${TEMP_BALANCE}`}</Text>
      </View>
      <View style={styles.section}>
        <ScrollableBarChart
          containerStyles={styles.barChartContainer}
          data={EXPENSES_MOCK_DATA}
          label="Expenses"
        />
        <Text style={styles.sectionValueText}>Expenses</Text>
      </View>
      <View style={styles.section}>
        <ScrollableBarChart
          containerStyles={styles.barChartContainer}
          data={INCOME_MOCK_DATA}
          label="Income"
        />
        <Text style={styles.sectionValueText}>Income</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceText: {
    alignSelf: 'center',
    bottom: 8,
    color: TEMP_BALANCE > 0 ? COLORS.SUCCESS : COLORS.ERROR,
    flex: 2,
    fontSize: 22,
    position: 'absolute'
  },
  barChartContainer: {
    height: '80%'
  },
  chart: {
    flex: 9,
    top: 32
  },
  chartContainer: {
    alignSelf: 'center',
    aspectRatio: '1/1',
    height: '110%',
    position: 'relative'
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    gap: 16,
    paddingBottom: 32
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
    flex: 1,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 4 },
    shadowRadius: 5,
    width: '80%'
  },
  sectionValueText: {
    alignSelf: 'center',
    bottom: 8,
    color: COLORS.BLACK_SHADE,
    flex: 2,
    fontSize: 20,
    position: 'absolute',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  welcomeText: {
    alignSelf: 'flex-start',
    color: COLORS.WHITE_SHADE,
    fontSize: 32,
    marginLeft: 36,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 3
  }
});

export default HomeScreen;
