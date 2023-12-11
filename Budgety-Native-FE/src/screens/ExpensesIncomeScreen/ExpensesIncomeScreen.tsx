import { COLORS } from '../../styles/Colors';
import { CONTEXT } from '../../data/constants';
import { setContext } from '../../slices/expenseIncomeSlice';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ExpensesIncomeStack from '../../routes/ExpensesIncomeStack/ExpensesIncomeStack';
import PieChartWrapper from '../../components/PieChartWrapper/PieChartWrapper';
import Title from '../../components/Title/Title';

interface IProps {
  navigation: any;
}

type TParamList = {
  ExpensesIncomeScreen: {
    context: 'EXPENSES' | 'INCOME';
  };
};

const ExpensesIncomeScreen = ({ navigation }: IProps) => {
  const context = useAppSelector(state => state.expensesIncome.context);
  const expensesCategories = useAppSelector(
    state => state.expensesIncome.expensesCategories
  );
  const incomeCategories = useAppSelector(
    state => state.expensesIncome.incomeCategories
  );

  const dispatch = useAppDispatch();

  const { i18n, t } = useTranslation();
  const { width } = useWindowDimensions();

  const { params } = useRoute<RouteProp<TParamList, 'ExpensesIncomeScreen'>>();

  useFocusEffect(
    useCallback(() => {
      if (params?.context) dispatch(setContext(params.context));
      navigation.navigate('CategoriesList');
    }, [params])
  );

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
            content: {
              ...styles.titleContent,
              fontSize: i18n.language === 'de' ? 24 : 28
            }
          }}
          text={context === CONTEXT.EXPENSES ? t('expenses') : t('income')}
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
    overflow: 'hidden'
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
