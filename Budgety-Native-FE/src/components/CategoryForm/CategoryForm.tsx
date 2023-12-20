import { API_URL } from '@env';
import { CATEGORY_FORM_TYPES, CONTEXT } from '../../data/constants';
import { COLORS } from '../../styles/Colors';
import { generateBoxShadowStyle } from '../../utils/helpers';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../../hooks/redux';
import { useTranslation } from 'react-i18next';
import ColorPickerModal from '../ColorPickerModal/ColorPickerModal';
import CustomButton from '../CustomButton/CustomButton';
import CustomTextInput from '../CustomTextInput/CustomTextInput';
import IconPickerModal from '../IconPickerModal/IconPickerModal';
import React, { useEffect, useState } from 'react';

type TFormTypes = 'ADD' | 'EDIT';

type TParamList = {
  ExpensesIncomeScreen: {
    categoryData?: {
      _id: string;
      bgColor: string;
      categoryName: string;
      icon: string;
    };
    type: TFormTypes;
  };
};
interface IProps {
  navigation: any;
}

const CategoryForm = ({ navigation }: IProps) => {
  const [color, setColor] = useState('#0000ff');
  const [icon, setIcon] = useState<any>('home');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [name, setName] = useState('');

  const context = useAppSelector(state => state.expensesIncome.context);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { t } = useTranslation();

  const { params } = useRoute<RouteProp<TParamList, 'ExpensesIncomeScreen'>>();

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
      const financeType = context === CONTEXT.EXPENSES ? 'expenses' : 'income';

      if (params.type === CATEGORY_FORM_TYPES.EDIT) {
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
          await fetch(url, options);
          navigation.navigate('CategoriesList');
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(error.message);
          }
        }
      }

      if (params.type === CATEGORY_FORM_TYPES.ADD) {
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
          await fetch(url, options);
          navigation.navigate('CategoriesList');
        } catch (error: unknown) {
          if (error instanceof Error) console.error(error.message);
        }
      }
    }
  };

  const handleClose = () => navigation.navigate('CategoriesList');

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
        {params.type === CATEGORY_FORM_TYPES.ADD
          ? t('addCategoryTitle')
          : t('editCategoryTitle')}
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
          <Text style={styles.formFieldName}>{t('categoryName')}</Text>
          <CustomTextInput
            cursorColor={COLORS.PRIMARY}
            customStyles={{
              container: styles.nameInputContainer,
              content: styles.nameInputContent
            }}
            defaultValue={name}
            onChangeText={handleNameChange}
            placeholderText={t('exampleCategoryName')}
            placeholderTextColor="#757575"
            selectionColor={COLORS.PRIMARY}
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formFieldName}>{t('categoryColor')}</Text>
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
          <Text style={styles.formFieldName}>{t('categoryIcon')}</Text>
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
        isDisabled={!name}
        onPress={handleApply}
        title={t('confirm')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  colorPreviewContainer: {
    borderRadius: 25,
    height: 36,
    width: 36,
    ...generateBoxShadowStyle(1, 1, '#000', 0.1, 1, 1)
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
    paddingBottom: Platform.OS === 'ios' ? 16 : 0,
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
    height: 36,
    justifyContent: 'center',
    width: 36,
    ...generateBoxShadowStyle(1, 1, '#000', 0.1, 1, 1)
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
