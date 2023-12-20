import { formatNumber } from '../../utils/helpers';
import { generateBoxShadowStyle } from '../../utils/helpers';
import { LANGUAGES_LOCALES } from '../../data/constants';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useAppSelector } from '../../hooks/redux';
interface IProps {
  amount: number;
  bgColor: string;
  handleQuickAdd: () => void;
  handleEditCategory: () => void;
  handleRemoveCategory: (categoryName: string, id: string) => void;
  iconName: string;
  id: string;
  name: string;
}

const CategoryListItem = ({
  amount,
  bgColor,
  handleEditCategory,
  handleQuickAdd,
  handleRemoveCategory,
  iconName,
  id,
  name
}: IProps) => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  return (
    <TouchableWithoutFeedback onPress={handleQuickAdd}>
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <MaterialIcons color="white" name={iconName as any} size={24} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.amount}>
            {formatNumber(
              amount,
              'currency' in currentUser ? currentUser.currency : 'USD',
              'language' in currentUser
                ? LANGUAGES_LOCALES[
                    currentUser.language as keyof typeof LANGUAGES_LOCALES
                  ]
                : LANGUAGES_LOCALES['EN']
            )}
          </Text>
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
            onPress={() => handleRemoveCategory(name, id)}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    ...generateBoxShadowStyle(
      0,
      3,
      Platform.OS === 'ios' ? '#00000020' : '#000',
      3,
      3,
      3
    ),
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 8,
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
    height: 48,
    justifyContent: 'center',
    width: 48
  },
  infoContainer: { flex: 5, justifyContent: 'center' },
  name: {
    fontSize: 16
  }
});

export default CategoryListItem;
