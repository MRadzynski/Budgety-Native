import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { CONTEXT, CURRENCIES_SIGNS } from '../../data/constants';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../hooks/redux';
import { useTranslation } from 'react-i18next';
import CustomButton from '../CustomButton/CustomButton';
import CustomTextInput from '../CustomTextInput/CustomTextInput';
import Dropdown from '../Dropdown/Dropdown';
import React, { useEffect, useState } from 'react';

interface IProps {
  navigation: any;
}

type TParamList = {
  ExpensesIncomeScreen: {
    categoryData: {
      _id: string;
      bgColor: string;
      categoryName: string;
      iconName: string;
    };
  };
};

type TCategory = {
  label: string;
  value: string;
};

const ExpenseIncomeForm = ({ navigation }: IProps) => {
  const [category, setCategory] = useState<TCategory | undefined>();
  const [price, setPrice] = useState('');

  const context = useAppSelector(state => state.expensesIncome.context);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const expensesCategories = useAppSelector(
    state => state.expensesIncome.expensesCategories
  );
  const incomeCategories = useAppSelector(
    state => state.expensesIncome.incomeCategories
  );

  const { params } = useRoute<RouteProp<TParamList, 'ExpensesIncomeScreen'>>();
  const { t } = useTranslation();

  useEffect(() => {
    if (params?.categoryData) {
      const { _id } = params.categoryData;

      let categoriesToSearchFor =
        context === CONTEXT.EXPENSES ? expensesCategories : incomeCategories;

      const formattedCategoriesToSearchFor = categoriesToSearchFor.map(
        category => ({
          label: category.categoryName,
          value: category._id
        })
      );

      const foundCategory = formattedCategoriesToSearchFor?.find(
        data => data.value === _id
      );

      setCategory(foundCategory ?? formattedCategoriesToSearchFor?.[0]);
    }
  }, []);

  const handleApply = async () => {
    if (currentUser && 'token' in currentUser) {
      const options = {
        body: JSON.stringify({
          amount: Number(price.replace(',', '.')),
          id: category?.value
        }),
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        method: 'POST'
      };
      const url = `${API_URL}/api/finance/${context.toLowerCase()}/add-${
        context === CONTEXT.EXPENSES ? 'expense' : 'income'
      }`;

      try {
        await fetch(url, options);
        navigation.navigate('CategoriesList');
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    }
  };

  const handleCategoryChange = (category: TCategory) => setCategory(category);

  const handleClose = () => navigation.navigate('CategoriesList');

  const handlePriceChange = (value: string) => {
    if (
      'language' in currentUser &&
      currentUser.language === 'EN' &&
      value.includes(',')
    )
      value = value.replace(',', '.');
    else if (
      'language' in currentUser &&
      currentUser.language !== 'EN' &&
      value.includes('.')
    )
      value = value.replace('.', ',');

    if (value === '' || /^\d+([.,]\d{0,2})?$/.test(value)) {
      setPrice(value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>
        {context === CONTEXT.EXPENSES ? t('addExpense') : t('addIncome')}
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
          <Text style={styles.formFieldName}>{`${t('price')} (${
            'currency' in currentUser
              ? CURRENCIES_SIGNS[
                  currentUser.currency as keyof typeof CURRENCIES_SIGNS
                ]
              : '$'
          })`}</Text>
          <CustomTextInput
            cursorColor={COLORS.PRIMARY}
            customStyles={{
              container: styles.priceInputContainer,
              content: styles.priceInputContent
            }}
            onChangeText={handlePriceChange}
            placeholderText={
              'language' in currentUser && currentUser.language === 'EN'
                ? '1.00'
                : '1,00'
            }
            placeholderTextColor="#757575"
            selectionColor={COLORS.PRIMARY}
            type="decimal-pad"
            value={price}
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formFieldName}>{t('category')}</Text>
          <Dropdown
            customStyles={{
              button: styles.categoryDropdownBtn,
              dropdownList: styles.categoryDropdownList,
              dropdownListItemValue: styles.categoryDropdownListItemValue
            }}
            data={
              context === CONTEXT.EXPENSES
                ? expensesCategories.map(item => ({
                    label: item.categoryName,
                    value: item._id
                  }))
                : incomeCategories.map(item => ({
                    label: item.categoryName,
                    value: item._id
                  }))
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
        isDisabled={!category || !price}
        onPress={handleApply}
        title={t('confirm')}
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
    maxHeight: 140,
    minHeight: 30,
    width: 120
  },
  categoryDropdownListItemValue: {
    textAlign: 'center'
  },
  confirmBtnContainer: {
    alignSelf: 'center',
    backgroundColor: COLORS.PRIMARY,
    marginBottom: 8,
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
