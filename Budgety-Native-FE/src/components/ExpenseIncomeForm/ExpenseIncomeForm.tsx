import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../hooks/redux';
import CustomButton from '../CustomButton/CustomButton';
import CustomTextInput from '../CustomTextInput/CustomTextInput';
import Dropdown from '../Dropdown/Dropdown';
import React, { useEffect, useState } from 'react';

interface IProps {
  navigation: any;
}

type ParamList = {
  ExpensesIncomeScreen: {
    categoryData: {
      _id: string;
      bgColor: string;
      categoryName: string;
      iconName: string;
    };
    context: string;
    expensesCategories: TCategory[];
    incomeCategories: TCategory[];
  };
};

type TCategory = {
  label: string;
  value: string;
};

const ExpenseIncomeForm = ({ navigation }: IProps) => {
  const [category, setCategory] = useState<TCategory | undefined>();
  const [price, setPrice] = useState('');

  const currentUser = useAppSelector(state => state.user.currentUser);

  const { params } = useRoute<RouteProp<ParamList, 'ExpensesIncomeScreen'>>();

  useEffect(() => {
    if (params?.categoryData) {
      const { _id } = params.categoryData;

      let categoriesToSearchFor =
        params.context === 'EXPENSES'
          ? params?.expensesCategories
          : params?.incomeCategories;

      const foundCategory = categoriesToSearchFor?.find(
        data => data.value === _id
      );

      setCategory(foundCategory ?? categoriesToSearchFor?.[0]);
    }
  }, []);

  const handleApply = async () => {
    if (currentUser && 'token' in currentUser) {
      const options = {
        body: JSON.stringify({
          amount: price,
          id: category?.value
        }),
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        method: 'POST'
      };
      const url = `${API_URL}/api/finance/${params.context.toLowerCase()}/add-${
        params.context === 'EXPENSES' ? 'expense' : 'income'
      }`;

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (params.context === 'EXPENSES' && data.expenses) {
          navigation.navigate('ExpensesIncomeScreen', {
            newExpenses: data.expenses
          });
        } else if (params.context === 'INCOME' && data.income) {
          navigation.navigate('ExpensesIncomeScreen', {
            newIncome: data.income
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    }
  };

  const handleCategoryChange = (category: TCategory) => setCategory(category);

  const handleClose = () => navigation.navigate('ExpensesIncomeScreen');

  const handlePriceChange = (value: string) => setPrice(value);

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>
        Add {params.context === 'EXPENSES' ? 'Expense' : 'Income'}
      </Text>
      <View style={styles.exitContainer}>
        <MaterialIcons
          color={COLORS.BLACK_SHADE}
          name="close"
          onPress={handleClose}
          size={28}
        />
      </View>
      <View style={styles.formBody}>
        <View style={styles.formRow}>
          <Text style={styles.formFieldName}>Price($)</Text>
          <CustomTextInput
            cursorColor={COLORS.PRIMARY}
            customStyles={{
              container: styles.priceInputContainer,
              content: styles.priceInputContent
            }}
            selectionColor={COLORS.PRIMARY}
            onChangeText={handlePriceChange}
            placeholderTextColor="#757575"
            placeholderText="1.00"
            type="decimal-pad"
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formFieldName}>Category</Text>
          <Dropdown
            customStyles={{
              button: styles.categoryDropdownBtn,
              dropdownList: styles.categoryDropdownList,
              dropdownListItemValue: styles.categoryDropdownListItemValue
            }}
            data={
              params.context === 'EXPENSES'
                ? params?.expensesCategories || []
                : params?.incomeCategories || []
            }
            defaultSelected={category}
            onSelect={handleCategoryChange}
          />
        </View>
      </View>
      <CustomButton
        customStyles={{
          container: styles.confirmBtnContainer,
          textContent: styles.confirmBtnText
        }}
        onPress={handleApply}
        title="Confirm"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryDropdownBtn: {
    width: 120
  },
  categoryDropdownList: {
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderWidth: 1,
    height: 140,
    width: 120
  },
  categoryDropdownListItemValue: {
    textAlign: 'center'
  },
  confirmBtnContainer: {
    alignSelf: 'center',
    backgroundColor: COLORS.PRIMARY,
    width: '70%'
  },
  confirmBtnText: {
    color: COLORS.WHITE_SHADE
  },
  container: {
    flex: 1,
    gap: 32,
    paddingHorizontal: 32,
    paddingTop: 16,
    position: 'relative'
  },
  exitContainer: {
    position: 'absolute',
    right: 16,
    top: 16
  },
  formBody: { flex: 1, gap: 24 },
  formFieldName: {
    color: COLORS.BLACK_SHADE,
    flex: 1,
    fontSize: 18
  },
  formRow: {
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 16,
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  formTitle: {
    fontSize: 24,
    textAlign: 'center'
  },
  priceInputContainer: {
    backgroundColor: COLORS.WHITE_SHADE,
    borderRadius: 8,
    flex: 1,
    maxWidth: 120
  },
  priceInputContent: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    color: 'black',
    padding: 8,
    textAlign: 'right'
  }
});

export default ExpenseIncomeForm;
