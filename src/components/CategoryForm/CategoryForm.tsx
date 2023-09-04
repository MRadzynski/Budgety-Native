import { COLORS } from '../../styles/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import CustomTextInput from '../CustomTextInput/CustomTextInput';
import React, { useState } from 'react';

type FormTypes = 'ADD' | 'EDIT';

interface IProps {
  navigation: any;
  type: FormTypes;
}

const CategoryForm = ({ navigation, type }: IProps) => {
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');
  const [name, setName] = useState('');

  const handleClose = () => navigation.navigate('ExpensesIncomeScreen');

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Edit Category</Text>
      <View style={styles.exitContainer}>
        <MaterialIcons
          color={COLORS.BLACK_SHADE}
          name="close"
          onPress={handleClose}
          size={28}
        />
      </View>
      <ScrollView style={styles.formBody}>
        <View style={styles.formRow}>
          <Text style={styles.formFieldName}>Name</Text>
          <CustomTextInput
            customStyles={{ container: { flex: 1 } }}
            onChangeText={value => setName(value)}
            placeholderText="i.e. Food"
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formFieldName}>Color</Text>
          <CustomTextInput
            onChangeText={value => setColor(value)}
            placeholderText="i.e. Green"
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formFieldName}>Icon</Text>
          <CustomTextInput
            onChangeText={value => setIcon(value)}
            placeholderText="i.e. Dog"
          />
        </View>
      </ScrollView>
      <CustomButton
        onPress={() => navigation.navigate('ExpensesIncomeScreen')}
        title="Confirm"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    position: 'relative'
  },
  exitContainer: {
    position: 'absolute',
    right: 16,
    top: 16
  },
  formBody: { flex: 1 },
  formFieldName: { color: COLORS.BLACK_SHADE, flex: 1, fontSize: 18 },
  formRow: {
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  formTitle: {
    fontSize: 24,
    textAlign: 'center'
  }
});

export default CategoryForm;
