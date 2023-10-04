import { COLORS } from '../../styles/Colors';
import { StyleSheet, Text, View } from 'react-native';

interface ICurrencyList {
  id: string;
  name: string;
  value: string;
}

interface ICurrencyListItemProps {
  index: number;
  item: ICurrencyList;
}

const CurrencyListItem = ({ item, index }: ICurrencyListItemProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            index % 2 === 0 ? COLORS.WHITE_SHADE : COLORS.LIGHT_GRAY
        }
      ]}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemValue}>{item.value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    paddingHorizontal: 24
  },
  itemName: {
    color: COLORS.BLACK_SHADE,
    fontSize: 20
  },
  itemValue: {
    color: COLORS.BLACK_SHADE,
    fontSize: 20
  }
});

export default CurrencyListItem;
