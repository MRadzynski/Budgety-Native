import { COLORS } from '../../styles/Colors';
import { Entypo } from '@expo/vector-icons';
import { formatNumber, getMonthNameByNumber } from '../../utils/helpers';
import { LANGUAGES_LOCALES } from '../../data/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '../../hooks/redux';
import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ScrollableBarChart from '../ScrollableBarChart/ScrollableBarChart';

interface IProps {
  data: {
    date: string;
    expenses: {
      amount: number;
      bgColor: string;
      categoryName: string;
    }[];
    income: {
      amount: number;
      bgColor: string;
      categoryName: string;
    }[];
    sumOfExpenses: number;
    sumOfIncome: number;
  };
}

const HistoryTab = ({ data }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = useAppSelector(state => state.user.currentUser);

  useFocusEffect(
    useCallback(() => {
      return () => setIsOpen(false);
    }, [])
  );

  const EXPENSES_BAR_DATA = useMemo(() => {
    if (!data.expenses) return [];

    const hasAtLeastOneValueAdded = data.expenses.some(
      expCat => expCat.amount > 0
    );

    if (!hasAtLeastOneValueAdded) return [];

    return data.expenses.map(expCategory => ({
      color: expCategory.bgColor,
      name: expCategory.categoryName,
      value: expCategory.amount
    }));
  }, [data.expenses]);

  const INCOME_BAR_DATA = useMemo(() => {
    if (!data.income) return [];

    const hasAtLeastOneValueAdded = data.income.some(
      incCat => incCat.amount > 0
    );

    if (!hasAtLeastOneValueAdded) return [];

    return data.expenses.map(incCategory => ({
      color: incCategory.bgColor,
      name: incCategory.categoryName,
      value: incCategory.amount
    }));
  }, [data.income]);

  const BALANCE = useMemo(
    () => data.sumOfIncome - data.sumOfExpenses,
    [data.sumOfIncome, data.sumOfExpenses]
  );

  const DATE_TO_DISPLAY = useMemo(() => {
    if (data.date === 'All Time') return 'All time';

    const splitDate = data.date.split('/');
    return `${getMonthNameByNumber(splitDate[0])} ${splitDate[1]}`;
  }, [data.date]);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsOpen(prev => !prev)}
        style={[
          styles.tabContainer,
          {
            borderBottomLeftRadius: isOpen ? 0 : 8,
            borderBottomRightRadius: isOpen ? 0 : 8
          }
        ]}
      >
        <Entypo
          color={COLORS.PRIMARY}
          name="chevron-right"
          size={16}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <Text style={styles.tabTitle}>{DATE_TO_DISPLAY}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.tabContent}>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>{`Expenses: ${formatNumber(
              data.sumOfExpenses,
              currentUser && 'currency' in currentUser
                ? currentUser.currency
                : 'USD',
              'language' in currentUser
                ? LANGUAGES_LOCALES[
                    currentUser.language as keyof typeof LANGUAGES_LOCALES
                  ]
                : LANGUAGES_LOCALES['EN']
            )}`}</Text>
            {EXPENSES_BAR_DATA.length ? (
              <ScrollableBarChart
                containerStyles={styles.barChartContainer}
                data={EXPENSES_BAR_DATA}
                label="Expenses"
              />
            ) : (
              <Text style={styles.notFoundText}>No Data To Present 😔</Text>
            )}
          </View>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>{`Income: ${formatNumber(
              data.sumOfIncome,
              currentUser && 'currency' in currentUser
                ? currentUser.currency
                : 'USD',
              'language' in currentUser
                ? LANGUAGES_LOCALES[
                    currentUser.language as keyof typeof LANGUAGES_LOCALES
                  ]
                : LANGUAGES_LOCALES['EN']
            )}`}</Text>
            {INCOME_BAR_DATA.length ? (
              <ScrollableBarChart
                containerStyles={styles.barChartContainer}
                data={INCOME_BAR_DATA}
                label="Income"
              />
            ) : (
              <Text style={styles.notFoundText}>No Data To Present 😔</Text>
            )}
          </View>
          <Text
            style={{
              ...styles.chartTitle,
              color:
                BALANCE > 0
                  ? COLORS.SUCCESS
                  : BALANCE === 0
                  ? COLORS.PRIMARY
                  : COLORS.ERROR
            }}
          >{`Balance: ${formatNumber(
            BALANCE,
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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  barChartContainer: {
    height: 140,
    marginTop: -8
  },
  chartContainer: {
    minHeight: 120
  },
  chartTitle: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    textAlign: 'center'
  },
  notFoundText: {
    alignSelf: 'center',
    color: COLORS.BLACK_SHADE,
    flex: 1,
    fontSize: 20,
    textAlignVertical: 'center'
  },
  tabContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    height: 40,
    marginTop: 16,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  tabContent: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  tabTitle: {
    color: COLORS.PRIMARY,
    fontSize: 14
  }
});

export default HistoryTab;
