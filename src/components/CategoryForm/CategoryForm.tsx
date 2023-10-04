import { COLORS } from '../../styles/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
      bgColor: string;
      iconName: string;
      name: string;
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

  const { params } = useRoute<RouteProp<ParamList, 'ExpensesIncomeScreen'>>();

  useEffect(() => {
    if (params?.categoryData) {
      const { bgColor, iconName, name } = params.categoryData;

      bgColor && setColor(bgColor);
      iconName && setIcon(iconName);
      name && setName(name);
    }
  }, []);

  const handleApply = () => {
    navigation.navigate('ExpensesIncomeScreen');
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
            customStyles={{
              container: styles.nameInputContainer,
              content: styles.nameInputContent
            }}
            defaultValue={name}
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
    backgroundColor: COLORS.PRIMARY
  },
  confirmBtnText: {
    color: COLORS.WHITE_SHADE
  },
  container: {
    flex: 1,
    gap: 32,
    paddingHorizontal: 32,
    paddingVertical: 16,
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
