import { COLORS } from '../../styles/Colors';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { formatNumber } from '../../utils/helpers';
import { useEffect, useState } from 'react';
import CurrencyListItem from '../../components/CurrencyListItem/CurrencyListItem';
import CustomButton from '../../components/CustomButton/CustomButton';
import Title from '../../components/Title/Title';

interface ICurrencyListState {
  id: string;
  name: string;
  value: string;
}

interface IDrawerProps {
  navigation: any;
}

const ExchangeScreen = ({ navigation }: IDrawerProps) => {
  const [currenciesList, setCurrenciesList] = useState<ICurrencyListState[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      const currenciesRes = await fetch(
        `https://api.frankfurter.app/latest?from=USD`
      );
      const data = await currenciesRes.json();

      if (data.rates) {
        const ratesAsEntries = Object.entries(data.rates);
        const formattedList = ratesAsEntries.map(entry => ({
          id: entry[0],
          name: entry[0],
          value: formatNumber(Number(entry[1]), entry[0])
        }));

        setCurrenciesList([
          {
            id: data.base,
            name: data.base,
            value: formatNumber(Number(data.amount), data.base)
          },
          ...formattedList
        ]);
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return (
    <View style={styles.container}>
      <Title
        customStyles={{
          content: styles.titleContent
        }}
        text="Exchange"
      />
      <Text style={styles.subText}>
        Check your balance in different currencies
      </Text>
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator
            color={COLORS.PRIMARY}
            size="large"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={currenciesList}
            renderItem={({ item, index }) => (
              <CurrencyListItem item={item} index={index} />
            )}
            style={styles.listContent}
          />
        )}
      </View>
      <View style={styles.buttonsContainer}>
        <CustomButton
          customStyles={{ container: styles.singleButtonContainer }}
          onPress={() => console.log('Current Month')}
          title="Current Month"
        />
        <CustomButton
          customStyles={{ container: styles.singleButtonContainer }}
          onPress={() => console.log('All time')}
          title="All Time"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
    marginTop: 20
  },
  container: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    gap: 16,
    paddingBottom: 32,
    paddingHorizontal: 32
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  listContent: {
    backgroundColor: 'white'
  },
  loader: {
    transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }]
  },
  singleButtonContainer: {
    flex: 1
  },
  subText: {
    color: COLORS.WHITE_SHADE,
    fontSize: 18,
    textAlign: 'center'
  },
  titleContent: {
    color: COLORS.WHITE_SHADE,
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 1
  }
});

export default ExchangeScreen;
