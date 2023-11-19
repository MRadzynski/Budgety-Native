import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { CONTEXT } from '../../data/constants';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
  setContext,
  setExpensesCategories,
  setIncomeCategories
} from '../../slices/expenseIncomeSlice';
import { StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useFocusEffect } from '@react-navigation/native';
import CategoryListItem from '../CategoryListItem/CategoryListItem';
import CustomButton from '../CustomButton/CustomButton';
import CustomModal from '../CustomModal/CustomModal';
import React, { useCallback, useEffect, useState } from 'react';

interface IProps {
  navigation: any;
}

const CategoryRoute = ({ navigation }: IProps) => {
  const [categoryIdToBeRemoved, setCategoryIdToBeRemoved] = useState('');
  const [categoryToBeRemoved, setCategoryToBeRemoved] = useState('');
  const [isModalShown, setIsModalShown] = useState(false);

  const context = useAppSelector(state => state.expensesIncome.context);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const expensesCategories = useAppSelector(
    state => state.expensesIncome.expensesCategories
  );
  const incomeCategories = useAppSelector(
    state => state.expensesIncome.incomeCategories
  );

  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
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

            data.monthlyExpenses &&
              dispatch(setExpensesCategories(data.monthlyExpenses));
            data.monthlyIncome &&
              dispatch(setIncomeCategories(data.monthlyIncome));
          } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message);
          }
        }
      };

      fetchCategories();
    }, [categoryToBeRemoved])
  );

  useEffect(() => {
    if (!isModalShown && categoryToBeRemoved) setCategoryToBeRemoved('');
  }, [isModalShown]);

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
        context === CONTEXT.EXPENSES ? 'expenses' : 'income'
      }/delete-category`;

      try {
        await fetch(url, options);
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    }
  };

  const handleAddCategory = () => {
    navigation.navigate('AddCategory', {
      type: 'ADD'
    });
  };

  const handleAddExpenseIncome = (category?: any) => {
    navigation.navigate('AddExpenseIncome', {
      categoryData: category
    });
  };

  const handleEditCategory = (category: any) => {
    navigation.navigate('EditCategory', {
      categoryData: category,
      type: 'EDIT'
    });
  };

  const handleRemoveCategory = (categoryName: string, id: string) => {
    setCategoryToBeRemoved(categoryName);
    setCategoryIdToBeRemoved(id);
    setIsModalShown(true);
  };

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
          onPress={() => dispatch(setContext(CONTEXT.EXPENSES))}
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
          onPress={() => dispatch(setContext(CONTEXT.INCOME))}
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
        ).map(item => (
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
  categoryListContainer: {
    flex: 1,
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 24
  },
  container: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1
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
  }
});

export default CategoryRoute;
