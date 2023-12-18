import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { CONTEXT, LANGUAGES_LOCALES } from '../../data/constants';
import { formatNumber } from '../../utils/helpers';
import { PieChartSelectEvent } from 'react-native-charts-wrapper';
import {
  setExpensesCategories,
  setIncomeCategories
} from '../../slices/expenseIncomeSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from '../../hoc/withErrorBoundary';
import ScrollableBarChart from '../../components/ScrollableBarChart/ScrollableBarChart';
import SemiPieChart from '../../components/SemiPieChart/SemiPieChart';

interface DrawerProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: DrawerProps) => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAppSelector(state => state.user.currentUser);
  const expensesCategories = useAppSelector(
    state => state.expensesIncome.expensesCategories
  );
  const incomeCategories = useAppSelector(
    state => state.expensesIncome.incomeCategories
  );

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  useEffect(() => {
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
          setIsLoading(true);

          const response = await fetch(url, options);
          const data = await response.json();

          data?.monthlyExpenses &&
            dispatch(setExpensesCategories(data.monthlyExpenses));
          data?.monthlyIncome &&
            dispatch(setIncomeCategories(data.monthlyIncome));
        } catch (error: unknown) {
          if (error instanceof Error) console.error(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  const handleSemiPieChartClick = (event: PieChartSelectEvent) => {
    if (!event.nativeEvent || !event.nativeEvent.label) return;
    const context = event.nativeEvent.label;

    navigation.navigate('ExpensesIncome', {
      context: context === 'Expenses' ? CONTEXT.EXPENSES : CONTEXT.INCOME
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

    const hasAtLeastOneValueAddedExp = expensesCategories?.some(
      expCat => expCat.amount > 0
    );

    const hasAtLeastOneValueAddedInc = incomeCategories?.some(
      incCat => incCat.amount > 0
    );

    if (!hasAtLeastOneValueAddedExp && !hasAtLeastOneValueAddedInc) {
      setBalance(0);
      return [];
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
      <Text
        ellipsizeMode="tail"
        numberOfLines={2}
        style={styles.welcomeText}
      >{`${t('welcome')} ${
        'username' in currentUser && currentUser.username
          ? `${currentUser.username}`
          : t('defaultUserWelcome')
      }! 👋`}</Text>
      <View
        style={{
          ...styles.section,
          justifyContent: BALANCE_PIE_DATA.length ? undefined : 'center'
        }}
      >
        {isLoading ? (
          <ActivityIndicator
            color={COLORS.PRIMARY}
            size="large"
            style={styles.loader}
          />
        ) : BALANCE_PIE_DATA.length ? (
          <View style={styles.chartContainer}>
            <SemiPieChart
              chartStyles={styles.chart}
              data={BALANCE_PIE_DATA}
              label="Balance"
              onSelectHandler={handleSemiPieChartClick}
            />
          </View>
        ) : (
          <Text style={styles.notFoundText}>{t('noData')} 😔</Text>
        )}
        <Text
          style={[
            styles.balanceText,
            {
              color:
                balance > 0
                  ? COLORS.SUCCESS
                  : balance === 0
                  ? COLORS.BLACK_SHADE
                  : COLORS.ERROR
            }
          ]}
        >{`${t('balance')}: ${formatNumber(
          balance,
          currentUser && 'currency' in currentUser
            ? currentUser.currency
            : 'USD',
          'language' in currentUser
            ? LANGUAGES_LOCALES[
                currentUser.language as keyof typeof LANGUAGES_LOCALES
              ]
            : LANGUAGES_LOCALES['EN']
        )}`}</Text>
      </View>
      <View
        style={{
          ...styles.section,
          justifyContent: EXPENSE_BAR_DATA.length ? undefined : 'center'
        }}
      >
        {isLoading ? (
          <ActivityIndicator
            color={COLORS.PRIMARY}
            size="large"
            style={styles.loader}
          />
        ) : EXPENSE_BAR_DATA.length ? (
          <ScrollableBarChart
            containerStyles={styles.barChartContainer}
            data={EXPENSE_BAR_DATA}
            label="Expenses"
          />
        ) : (
          <Text style={styles.notFoundText}>{t('noData')} 😔</Text>
        )}
        <Text style={styles.sectionValueText}>{t('expenses')}</Text>
      </View>
      <View
        style={{
          ...styles.section,
          justifyContent: INCOME_BAR_DATA.length ? undefined : 'center'
        }}
      >
        {isLoading ? (
          <ActivityIndicator
            color={COLORS.PRIMARY}
            size="large"
            style={styles.loader}
          />
        ) : INCOME_BAR_DATA.length ? (
          <ScrollableBarChart
            containerStyles={styles.barChartContainer}
            data={INCOME_BAR_DATA}
            label="Income"
          />
        ) : (
          <Text style={styles.notFoundText}>{t('noData')} 😔</Text>
        )}
        <Text style={styles.sectionValueText}>{t('income')}</Text>
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
  loader: {
    flex: 1,
    transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }]
  },
  notFoundText: {
    alignSelf: 'center',
    color: COLORS.BLACK_SHADE,
    fontSize: 20,
    padding: 20,
    textAlign: 'center'
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

export default withErrorBoundary(HomeScreen);
