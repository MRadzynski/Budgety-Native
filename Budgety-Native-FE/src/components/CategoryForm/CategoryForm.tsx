import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '../../hooks/redux';
import ColorPickerModal from '../ColorPickerModal/ColorPickerModal';
import CustomButton from '../CustomButton/CustomButton';
import CustomTextInput from '../CustomTextInput/CustomTextInput';
import IconPickerModal from '../IconPickerModal/IconPickerModal';
import React, { useEffect, useState } from 'react';

type FormTypes = 'ADD' | 'EDIT';

interface IProps {
  navigation: any;
  type: FormTypes;
}

type ParamList = {
  ExpensesIncomeScreen: {
    categoryData?: {
      _id: string;
      bgColor: string;
      categoryName: string;
      icon: string;
    };
    context: string;
  };
};

const CategoryForm = ({ navigation, type }: IProps) => {
  const [color, setColor] = useState('#0000ff');
  const [icon, setIcon] = useState<any>('home');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [name, setName] = useState('');

  const currentUser = useAppSelector(state => state.user.currentUser);

  const { params } = useRoute<RouteProp<ParamList, 'ExpensesIncomeScreen'>>();

  useEffect(() => {
    if (params?.categoryData) {
      const { bgColor, categoryName, icon } = params.categoryData;

      bgColor && setColor(bgColor);
      icon && setIcon(icon);
      categoryName && setName(categoryName);
    }
  }, []);

  const handleApply = async () => {
    if (currentUser && 'token' in currentUser) {
      const financeType = params.context === 'EXPENSES' ? 'expenses' : 'income';
      if (type === 'EDIT') {
        const options = {
          body: JSON.stringify({
            bgColor: color,
            categoryName: name,
            icon,
            id: params.categoryData?._id
          }),
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          },
          method: 'PATCH'
        };
        const url = `${API_URL}/api/finance/${financeType}/edit-category`;

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
          if (error instanceof Error) {
            console.error(error.message);
          }
        }
      }

      if (type === 'ADD') {
        const options = {
          body: JSON.stringify({
            bgColor: color,
            categoryName: name,
            icon
          }),
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          },
          method: 'POST'
        };
        const url = `${API_URL}/api/finance/${financeType}/add-category`;

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
    }
  };

  const handleClose = () => navigation.navigate('ExpensesIncomeScreen');

  const handleColorPickerApply = (selectedColor: string) =>
    setColor(selectedColor);

  const handleColorPickerModalClose = () => setIsColorPickerOpen(false);

  const handleColorPickerModalOpen = () => setIsColorPickerOpen(true);

  const handleIconPickerApply = (iconName: string) => setIcon(iconName);

  const handleIconPickerModalClose = () => setIsIconPickerOpen(false);

  const handleIconPickerModalOpen = () => setIsIconPickerOpen(true);

  const handleNameChange = (name: string) => setName(name);

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>
        {type === 'ADD' ? 'Add' : 'Edit'} Category
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
          <Text style={styles.formFieldName}>Name</Text>
          <CustomTextInput
            cursorColor={COLORS.PRIMARY}
            customStyles={{
              container: styles.nameInputContainer,
              content: styles.nameInputContent
            }}
            defaultValue={name}
            selectionColor={COLORS.PRIMARY}
            onChangeText={handleNameChange}
            placeholderTextColor="#757575"
            placeholderText="i.e. Food"
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formFieldName}>Color</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleColorPickerModalOpen}
            style={[styles.colorPreviewContainer, { backgroundColor: color }]}
          />
          <ColorPickerModal
            defaultColor={color}
            isVisible={isColorPickerOpen}
            onApply={handleColorPickerApply}
            onClose={handleColorPickerModalClose}
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formFieldName}>Icon</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleIconPickerModalOpen}
            style={[styles.iconContainer, { backgroundColor: color }]}
          >
            <MaterialIcons color={COLORS.WHITE_SHADE} name={icon} size={24} />
          </TouchableOpacity>
          <IconPickerModal
            bgColor={color}
            isVisible={isIconPickerOpen}
            onApply={handleIconPickerApply}
            onClose={handleIconPickerModalClose}
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
  colorPreviewContainer: {
    borderRadius: 25,
    elevation: 1,
    height: 36,
    width: 36
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
  formFieldName: { color: COLORS.BLACK_SHADE, flex: 1, fontSize: 18 },
  formRow: {
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  formTitle: {
    fontSize: 24,
    textAlign: 'center'
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 25,
    elevation: 1,
    height: 36,
    justifyContent: 'center',
    width: 36
  },
  nameInputContainer: {
    backgroundColor: COLORS.WHITE_SHADE,
    borderRadius: 8,
    flex: 1
  },
  nameInputContent: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    color: 'black',
    padding: 8
  }
});

export default CategoryForm;
