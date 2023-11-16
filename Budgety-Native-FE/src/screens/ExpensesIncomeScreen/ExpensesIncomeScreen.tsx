import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppSelector } from '../../hooks/redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import CategoryForm from '../../components/CategoryForm/CategoryForm';
import CategoryListItem from '../../components/CategoryListItem/CategoryListItem';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomModal from '../../components/CustomModal/CustomModal';
import ExpenseIncomeForm from '../../components/ExpenseIncomeForm/ExpenseIncomeForm';
import PieChartWrapper from '../../components/PieChartWrapper/PieChartWrapper';
import Title from '../../components/Title/Title';

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

const CONTEXT = {
  EXPENSES: 'EXPENSES',
  INCOME: 'INCOME'
};

const ExpensesIncomeScreen = ({ navigation }: DrawerProps) => {
  const [categoryIdToBeRemoved, setCategoryIdToBeRemoved] = useState('');
  const [categoryToBeRemoved, setCategoryToBeRemoved] = useState('');
  const [context, setContext] = useState(CONTEXT.EXPENSES);
  const [expensesCategories, setExpensesCategories] = useState<
    IExpensesIncomeCategory[] | null
  >(null);
  const [incomeCategories, setIncomeCategories] = useState<
    IExpensesIncomeCategory[] | null
  >(null);
  const [isModalShown, setIsModalShown] = useState(false);

  const currentUser = useAppSelector(state => state.user.currentUser);

  const { width } = useWindowDimensions();
  const route = useRoute();

  useEffect(() => {
    const fetchCategories = async () => {
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

          data.monthlyExpenses && setExpensesCategories(data.monthlyExpenses);
          data.monthlyIncome && setIncomeCategories(data.monthlyIncome);
        } catch (error: unknown) {
          if (error instanceof Error) console.error(error.message);
        }
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isModalShown && categoryToBeRemoved) setCategoryToBeRemoved('');
  }, [isModalShown]);

  useFocusEffect(
    useCallback(() => {
      if (route && (route?.params as any)?.newExpenses) {
        setExpensesCategories((route.params as any).newExpenses);
      }
      if (route && (route?.params as any)?.newIncome) {
        setIncomeCategories((route.params as any).newIncome);
      }
    }, [route])
  );

  const confirmCategoryDeletion = async () => {
    if (currentUser && 'token' in currentUser) {
      const options = {
        body: JSON.stringify({
          id: categoryIdToBeRemoved
        }),
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      };
      const url = `${API_URL}/api/finance/${
        context === 'EXPENSES' ? 'expenses' : 'income'
      }/delete-category`;

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!data.expenses || !data.income) return;

        context === 'EXPENSES'
          ? setExpensesCategories(data.expenses)
          : setIncomeCategories(data.income);
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    }
  };

  const handleAddCategory = () => {
    navigation.navigate('AddCategory', { context });
  };

  const handleAddExpenseIncome = (category?: any) => {
    navigation.navigate('AddExpenseIncome', {
      categoryData: category,
      context,
      expensesCategories: expensesCategories?.map(item => ({
        label: item.categoryName,
        value: item._id
      })),
      incomeCategories: incomeCategories?.map(item => ({
        label: item.categoryName,
        value: item._id
      }))
    });
  };

  const handleEditCategory = (category: any) => {
    navigation.navigate('EditCategory', {
      categoryData: category,
      context
    });
  };

  const handleRemoveCategory = (categoryName: string, id: string) => {
    setCategoryToBeRemoved(categoryName);
    setCategoryIdToBeRemoved(id);
    setIsModalShown(true);
  };

  const getContentBody = () => {
    if (['AddCategory', 'EditCategory'].includes(route.name)) {
      return (
        <CategoryForm
          navigation={navigation}
          type={route.name === 'EditCategory' ? 'EDIT' : 'ADD'}
        />
      );
    }

    if (route.name === 'AddExpenseIncome') {
      return <ExpenseIncomeForm navigation={navigation} />;
    }

    return (
      <>
        <CustomModal
          isVisible={isModalShown}
          message={`You are about to delete the "${categoryToBeRemoved}" category.`}
          onConfirm={confirmCategoryDeletion}
          setIsVisible={setIsModalShown}
        />
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setContext(CONTEXT.EXPENSES)}
            style={[
              styles.tab,
              context === CONTEXT.EXPENSES ? styles.activeTab : {}
            ]}
          >
            <Text
              style={[
                styles.tabText,
                context === CONTEXT.EXPENSES ? styles.activeTabText : {}
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setContext(CONTEXT.INCOME)}
            style={[
              styles.tab,
              context === CONTEXT.INCOME ? styles.activeTab : {}
            ]}
          >
            <Text
              style={[
                styles.tabText,
                context === CONTEXT.INCOME ? styles.activeTabText : {}
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.categoryListContainer}>
          {(context === CONTEXT.EXPENSES
            ? expensesCategories
            : incomeCategories
          )?.map(item => (
            <CategoryListItem
              amount={item.amount}
              bgColor={item.bgColor}
              handleEditCategory={() => handleEditCategory(item)}
              handleQuickAdd={() => handleAddExpenseIncome(item)}
              handleRemoveCategory={handleRemoveCategory}
              iconName={item.icon}
              id={item._id}
              key={item.categoryName}
              name={item.categoryName}
            />
          ))}
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleAddCategory}
            style={styles.addCategoryContainer}
          >
            <View style={styles.addCategoryIconContainer}>
              <MaterialIcons color="white" name="add" size={32} />
            </View>
            <View style={styles.addCategoryInfoContainer}>
              <Text style={styles.addCategoryInfoText}>Add new category</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.addExpenseIncomeContainer}>
          <CustomButton
            customStyles={{
              container: styles.addExpenseIncomeBtnContainer,
              textContent: styles.addExpenseIncomeBtnContent
            }}
            onPress={() => handleAddExpenseIncome()}
            title={`Add ${context === CONTEXT.EXPENSES ? 'Expense' : 'Income'}`}
          />
        </View>
      </>
    );
  };

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
      <View style={styles.bodyContainer}>{getContentBody()}</View>
      {/* </KeyboardAwareScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  activeTab: {
    borderTopColor: COLORS.PRIMARY
  },
  activeTabText: {
    color: COLORS.PRIMARY
  },
  addCategoryContainer: {
    backgroundColor: '#efefef',
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
    marginHorizontal: 6,
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  addCategoryIconContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 50,
    justifyContent: 'center',
    height: 48,
    width: 48
  },
  addCategoryInfoContainer: {
    justifyContent: 'center'
  },
  addCategoryInfoText: {
    fontSize: 16
  },
  addExpenseIncomeBtnContainer: {
    alignSelf: 'center',
    backgroundColor: COLORS.PRIMARY,
    width: '70%'
  },
  addExpenseIncomeBtnContent: {
    color: COLORS.WHITE_SHADE
  },
  addExpenseIncomeContainer: {
    paddingHorizontal: 32
  },
  bodyContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flex: 6,
    paddingBottom: 8
  },
  categoryListContainer: {
    flex: 1,
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 24
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
  tab: {
    alignItems: 'center',
    borderTopColor: 'transparent',
    borderTopWidth: 2,
    marginTop: 6,
    maxWidth: 130,
    minWidth: 130
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-evenly',
    paddingHorizontal: 32
  },
  tabText: {
    color: COLORS.BLACK_SHADE,
    fontSize: 20,
    paddingTop: 4
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
