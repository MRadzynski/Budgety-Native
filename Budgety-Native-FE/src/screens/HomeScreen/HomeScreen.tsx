import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { formatNumber } from '../../utils/helpers';
import { PieChartSelectEvent } from 'react-native-charts-wrapper';
import { StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../hooks/redux';
import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ScrollableBarChart from '../../components/ScrollableBarChart/ScrollableBarChart';
import SemiPieChart from '../../components/SemiPieChart/SemiPieChart';

interface DrawerProps {
  navigation: any;
}

interface IExpensesIncomeCategory {
  _id: string;
  amount: number;
  bgColor: string;
  categoryName: string;
  icon: string;
}

const HomeScreen = ({ navigation }: DrawerProps) => {
  const [balance, setBalance] = useState(0);
  const [expensesCategories, setExpensesCategories] = useState<
    IExpensesIncomeCategory[] | null
  >(null);
  const [incomeCategories, setIncomeCategories] = useState<
    IExpensesIncomeCategory[] | null
  >(null);

  const currentUser = useAppSelector(state => state.user.currentUser);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (currentUser && 'token' in currentUser) {
          const options = {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              'Content-Type': 'application/json'
            },
            method: 'GET'
          };
          const url = `${API_URL}/api/finance/get-categories-monthly`;

          try {
            const response = await fetch(url, options);
            const data = await response.json();

            data?.monthlyExpenses &&
              setExpensesCategories(data.monthlyExpenses);
            data?.monthlyIncome && setIncomeCategories(data.monthlyIncome);
          } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message);
          }
        }
      };

      fetchData();
    }, [])
  );

  const handleSemiPieChartClick = (event: PieChartSelectEvent) => {
    if (!event.nativeEvent || !event.nativeEvent.label) return;
    const context = event.nativeEvent.label;

    //TODO: navigate to the proper tab with context ^
    navigation.navigate('ExpensesIncome', {
      screen: 'ExpensesIncomeScreen'
    });
  };

  const BALANCE_PIE_DATA = useMemo(() => {
    let expensesSum = 0;
    let incomeSum = 0;

    if (expensesCategories) {
      expensesSum = expensesCategories.reduce(
        (acc, expCategory) => (acc += expCategory.amount),
        0
      );
    }

    if (incomeCategories) {
      incomeSum = incomeCategories.reduce(
        (acc, incCategory) => (acc += incCategory.amount),
        0
      );
    }

    setBalance(incomeSum - expensesSum);

    return [
      { color: '#ED4337', name: 'Expenses', value: expensesSum },
      { color: '#4BB543', name: 'Income', value: incomeSum }
    ];
  }, [incomeCategories, expensesCategories]);

  const EXPENSE_BAR_DATA = useMemo(() => {
    if (!expensesCategories) return [];

    const hasAtLeastOneValueAdded = expensesCategories.some(
      expCat => expCat.amount > 0
    );

    if (!hasAtLeastOneValueAdded) return [];

    return expensesCategories.map(expCategory => ({
      color: expCategory.bgColor,
      name: expCategory.categoryName,
      value: expCategory.amount
    }));
  }, [expensesCategories]);

  const INCOME_BAR_DATA = useMemo(() => {
    if (!incomeCategories) return [];

    const hasAtLeastOneValueAdded = incomeCategories.some(
      incCat => incCat.amount > 0
    );

    if (!hasAtLeastOneValueAdded) return [];

    return incomeCategories.map(incCategory => ({
      color: incCategory.bgColor,
      name: incCategory.categoryName,
      value: incCategory.amount
    }));
  }, [incomeCategories]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>{`Hey ${
        'username' in currentUser && currentUser.username
          ? currentUser.username
          : 'User'
      }! 👋`}</Text>
      <View style={styles.section}>
        <View style={styles.chartContainer}>
          <SemiPieChart
            chartStyles={styles.chart}
            data={BALANCE_PIE_DATA}
            label="Balance"
            onSelectHandler={handleSemiPieChartClick}
          />
        </View>
        <Text
          style={[
            styles.balanceText,
            {
              color: balance > 0 ? COLORS.SUCCESS : COLORS.ERROR
            }
          ]}
        >{`Balance: ${formatNumber(
          balance,
          currentUser && 'currency' in currentUser
            ? currentUser.currency
            : 'USD'
        )}`}</Text>
      </View>
      <View style={styles.section}>
        <ScrollableBarChart
          containerStyles={styles.barChartContainer}
          data={EXPENSE_BAR_DATA}
          label="Expenses"
        />
        <Text style={styles.sectionValueText}>Expenses</Text>
      </View>
      <View style={styles.section}>
        <ScrollableBarChart
          containerStyles={styles.barChartContainer}
          data={INCOME_BAR_DATA}
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
