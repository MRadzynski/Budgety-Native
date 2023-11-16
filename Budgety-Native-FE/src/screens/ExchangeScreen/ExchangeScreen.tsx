import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { formatNumber } from '../../utils/helpers';
import { useAppSelector } from '../../hooks/redux';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import CurrencyListItem from '../../components/CurrencyListItem/CurrencyListItem';
import CustomButton from '../../components/CustomButton/CustomButton';
import Title from '../../components/Title/Title';

interface ICurrencyListBaseState {
  id: string;
  name: string;
  value: number;
}

interface ICurrencyListState {
  id: string;
  name: string;
  value: string;
}

interface IDrawerProps {
  navigation: any;
}

const ExchangeScreen = ({ navigation }: IDrawerProps) => {
  const [allTimeBalance, setAllTimeBalance] = useState(0);
  const [allTimeCurrenciesList, setAllTimeCurrenciesList] = useState<
    ICurrencyListState[] | null
  >(null);
  const [context, setContext] = useState('monthly');
  const [currenciesList, setCurrenciesList] = useState<
    ICurrencyListBaseState[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyBalance, setMonthlyBalance] = useState(0);
  const [monthlyCurrenciesList, setMonthlyCurrenciesList] = useState<
    ICurrencyListState[] | null
  >(null);

  const currentUser = useAppSelector(state => state.user.currentUser);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      const currenciesRes = await fetch(
        `https://api.frankfurter.app/latest?from=${
          currentUser && 'currency' in currentUser
            ? currentUser.currency
            : 'USD'
        }`
      );
      const data = await currenciesRes.json();

      if (data.rates) {
        const ratesAsEntries = Object.entries(data.rates);
        const formattedList = ratesAsEntries.map(entry => ({
          id: entry[0],
          name: entry[0],
          value: entry[1]
        }));

        setCurrenciesList([
          {
            id: data.base,
            name: data.base,
            value: data.amount
          },
          ...formattedList
        ]);
      }
    };

    fetchCurrencies();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (currentUser && 'token' in currentUser) {
          const options = {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              'Content-Type': 'application/json'
            },
            method: 'GET'
          };
          const url = `${API_URL}/api/finance/get-balance`;

          try {
            setIsLoading(true);
            const response = await fetch(url, options);
            const data = await response.json();

            data.allTimeBalance && setAllTimeBalance(data.allTimeBalance);
            data.monthlyBalance && setMonthlyBalance(data.monthlyBalance);
            setIsLoading(false);
          } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message);
          } finally {
            setIsLoading(false);
          }
        }
      };

      fetchData();
    }, [])
  );

  useEffect(() => {
    if (currenciesList.length > 0) {
      const newCurrenciesList = currenciesList.map(currency => ({
        ...currency,
        value: formatNumber(
          Number(currency.value) * allTimeBalance,
          currency.name
        )
      }));
      setAllTimeCurrenciesList(newCurrenciesList);
    }
  }, [allTimeBalance, currenciesList]);

  useEffect(() => {
    if (currenciesList.length > 0) {
      const newCurrenciesList = currenciesList.map(currency => ({
        ...currency,
        value: formatNumber(
          Number(currency.value) * monthlyBalance,
          currency.name
        )
      }));
      setMonthlyCurrenciesList(newCurrenciesList);
    }
  }, [currenciesList, monthlyBalance]);

  const handleContextChange = (context: 'all-time' | 'monthly') =>
    setContext(context);

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
            data={
              context === 'monthly'
                ? monthlyCurrenciesList
                : allTimeCurrenciesList
            }
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
          onPress={() => handleContextChange('monthly')}
          title="Current Month"
        />
        <CustomButton
          customStyles={{ container: styles.singleButtonContainer }}
          onPress={() => handleContextChange('all-time')}
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
    borderRadius: 8,
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
    borderRadius: 8,
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
