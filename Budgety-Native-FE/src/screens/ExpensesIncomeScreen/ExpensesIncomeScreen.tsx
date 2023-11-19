import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { CONTEXT } from '../../data/constants';
import {
  setExpensesCategories,
  setIncomeCategories
} from '../../slices/expenseIncomeSlice';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useCallback, useEffect, useMemo } from 'react';
import ExpensesIncomeStack from '../../routes/ExpensesIncomeStack/ExpensesIncomeStack';
import PieChartWrapper from '../../components/PieChartWrapper/PieChartWrapper';
import Title from '../../components/Title/Title';
import { useFocusEffect } from '@react-navigation/native';

const ExpensesIncomeScreen = () => {
  const dispatch = useAppDispatch();

  const context = useAppSelector(state => state.expensesIncome.context);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const expensesCategories = useAppSelector(
    state => state.expensesIncome.expensesCategories
  );
  const incomeCategories = useAppSelector(
    state => state.expensesIncome.incomeCategories
  );

  const { width } = useWindowDimensions();

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchCategories = async () => {
  //       if (currentUser && 'token' in currentUser) {
  //         const options = {
  //           headers: {
  //             Authorization: `Bearer ${currentUser.token}`,
  //             'Content-Type': 'application/json'
  //           },
  //           method: 'GET'
  //         };
  //         const url = `${API_URL}/api/finance/get-categories-monthly`;

  //         try {
  //           const response = await fetch(url, options);
  //           const data = await response.json();

  //           data.monthlyExpenses &&
  //             dispatch(setExpensesCategories(data.monthlyExpenses));
  //           data.monthlyIncome &&
  //             dispatch(setIncomeCategories(data.monthlyIncome));
  //         } catch (error: unknown) {
  //           if (error instanceof Error) console.error(error.message);
  //         }
  //       }
  //     };

  //     fetchCategories();
  //   }, [])
  // );
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     if (currentUser && 'token' in currentUser) {
  //       const options = {
  //         headers: {
  //           Authorization: `Bearer ${currentUser.token}`,
  //           'Content-Type': 'application/json'
  //         },
  //         method: 'GET'
  //       };
  //       const url = `${API_URL}/api/finance/get-categories-monthly`;

  //       try {
  //         const response = await fetch(url, options);
  //         const data = await response.json();

  //         data.monthlyExpenses &&
  //           dispatch(setExpensesCategories(data.monthlyExpenses));
  //         data.monthlyIncome &&
  //           dispatch(setIncomeCategories(data.monthlyIncome));
  //       } catch (error: unknown) {
  //         if (error instanceof Error) console.error(error.message);
  //       }
  //     }
  //   };

  //   fetchCategories();

  //   console.log('mount', context);
  //   return () => {
  //     console.log('-------');
  //     console.log('unmount screen');
  //     console.log('-------');
  //   };
  // }, []);

  const EXPENSES_CATEGORIES_PIE_DATA = useMemo(
    () =>
      expensesCategories?.map(expCategory => ({
        color: expCategory.bgColor,
        name: expCategory.categoryName,
        value: expCategory.amount
      })),
    [expensesCategories]
  );

  const INCOME_CATEGORIES_PIE_DATA = useMemo(
    () =>
      incomeCategories?.map(incCategory => ({
        color: incCategory.bgColor,
        name: incCategory.categoryName,
        value: incCategory.amount
      })),
    [incomeCategories]
  );

  const SUM_OF_EXPENSES = useMemo(() => {
    if (!expensesCategories) return 0;

    return expensesCategories?.reduce(
      (acc, expCategory) => (acc += expCategory.amount),
      0
    );
  }, [expensesCategories]);

  const SUM_OF_INCOME = useMemo(() => {
    if (!incomeCategories) return 0;

    return incomeCategories?.reduce(
      (acc, expCategory) => (acc += expCategory.amount),
      0
    );
  }, [incomeCategories]);

  return (
    <View style={styles.container}>
      {/* // <KeyboardAwareScrollView
    //   style={{
    //     backgroundColor: COLORS.PRIMARY
    //   }}
    //   extraScrollHeight={200}
    //   enableOnAndroid={true}
    //   scrollEnabled={false}
    //   resetScrollToCoords={{ x: 0, y: 0 }}
    //   contentContainerStyle={{
    //     backgroundColor: COLORS.PRIMARY,
    //     // flexGrow: 1
    //     flex: 1
    //     // justifyContent: 'center'
    //   }}
    // > */}
      <View style={styles.headerContainer}>
        <Title
          customStyles={{
            container: styles.titleContainer,
            content: styles.titleContent
          }}
          text={context === CONTEXT.EXPENSES ? 'Expenses' : 'Income'}
        />
        <PieChartWrapper
          centerValue={
            context === CONTEXT.EXPENSES
              ? String(SUM_OF_EXPENSES)
              : String(SUM_OF_INCOME)
          }
          containerStyles={{
            ...styles.chartContainer,
            height: width / 2,
            width: width / 2
          }}
          data={
            context === CONTEXT.EXPENSES
              ? EXPENSES_CATEGORIES_PIE_DATA || []
              : INCOME_CATEGORIES_PIE_DATA || []
          }
          label="Balance"
        />
      </View>
      <View style={styles.bodyContainer}>
        <ExpensesIncomeStack />
      </View>
      {/* </KeyboardAwareScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flex: 6,
    paddingBottom: 8
  },
  chartContainer: {
    borderRadius: 100,
    elevation: 10,
    shadowColor: '#00000066'
  },
  container: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1
  },
  headerContainer: {
    flex: 3.5,
    flexDirection: 'row',
    paddingBottom: 16,
    paddingHorizontal: 24
  },
  titleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 4
  },
  titleContent: {
    fontSize: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 1,
    top: '20%'
  }
});

export default ExpensesIncomeScreen;
