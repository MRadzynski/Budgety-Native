import { formatNumber } from '../../utils/helpers';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
  amount: number;
  bgColor: string;
  handleEditCategory: () => void;
  iconName: string;
  name: string;
  setIsModalShown: (isVisible: boolean) => void;
}

const CategoryListItem = ({
  amount,
  bgColor,
  handleEditCategory,
  iconName,
  name,
  setIsModalShown
}: IProps) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Text>{iconName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.amount}>{formatNumber(amount, 'USD')}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <MaterialIcons
          color="orange"
          name="edit"
          onPress={handleEditCategory}
          size={24}
        />
        <MaterialIcons
          color="red"
          name="delete-outline"
          size={24}
          onPress={() => setIsModalShown(true)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    alignItems: 'center',
    flex: 2,
    flexDirection: 'row',
    gap: 8
  },
  amount: {
    fontSize: 12
  },
  container: {
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
  iconContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    height: 48,
    width: 48
  },
  infoContainer: { flex: 6, justifyContent: 'center' },
  name: {
    fontSize: 16
  }
});

export default CategoryListItem;
