import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { formatDate, formatNumber } from '../../utils/helpers';
import { LANGUAGES_LOCALES } from '../../data/constants';
import { useAppSelector } from '../../hooks/redux';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
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
  const [currenciesDate, setCurrenciesDate] = useState('');
  const [currenciesList, setCurrenciesList] = useState<
    ICurrencyListBaseState[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyBalance, setMonthlyBalance] = useState(0);
  const [monthlyCurrenciesList, setMonthlyCurrenciesList] = useState<
    ICurrencyListState[] | null
  >(null);

  const currentUser = useAppSelector(state => state.user.currentUser);

  const { t } = useTranslation();

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
        data.date && setCurrenciesDate(data.date);
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
  }, [currentUser]);

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

            Number.isFinite(data?.allTimeBalance) &&
              setAllTimeBalance(data.allTimeBalance);
            Number.isFinite(data?.monthlyBalance) &&
              setMonthlyBalance(data.monthlyBalance);
            setIsLoading(false);
          } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message);
          } finally {
            setIsLoading(false);
          }
        }
      };

      fetchData();

      return () => setContext('monthly');
    }, [])
  );

  useEffect(() => {
    if (currenciesList.length > 0) {
      const newCurrenciesList = currenciesList.map(currency => ({
        ...currency,
        value: formatNumber(
          Number(currency.value) * allTimeBalance,
          currency.name,
          'language' in currentUser
            ? LANGUAGES_LOCALES[
                currentUser.language as keyof typeof LANGUAGES_LOCALES
              ]
            : LANGUAGES_LOCALES['EN']
        )
      }));
      setAllTimeCurrenciesList(newCurrenciesList);
    }
  }, [allTimeBalance, currenciesList, currentUser]);

  useEffect(() => {
    if (currenciesList.length > 0) {
      const newCurrenciesList = currenciesList.map(currency => ({
        ...currency,
        value: formatNumber(
          Number(currency.value) * monthlyBalance,
          currency.name,
          'language' in currentUser
            ? LANGUAGES_LOCALES[
                currentUser.language as keyof typeof LANGUAGES_LOCALES
              ]
            : LANGUAGES_LOCALES['EN']
        )
      }));
      setMonthlyCurrenciesList(newCurrenciesList);
    }
  }, [currenciesList, currentUser, monthlyBalance]);

  const handleContextChange = (context: 'all-time' | 'monthly') => () =>
    setContext(context);

  return (
    <View style={styles.container}>
      <Title
        customStyles={{
          content: styles.titleContent
        }}
        text={t('exchange')}
      />
      <Text style={styles.subText}>{t('exchangeSubTitle')}</Text>
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator
            color={COLORS.PRIMARY}
            size="large"
            style={styles.loader}
          />
        ) : (
          <>
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
            <Text style={{ textAlign: 'center' }}>{`${t(
              'currencyRatesDate'
            )} ${formatDate(
              new Date(currenciesDate || Date.now()),
              'language' in currentUser
                ? LANGUAGES_LOCALES[
                    currentUser.language as keyof typeof LANGUAGES_LOCALES
                  ]
                : LANGUAGES_LOCALES['EN']
            )}`}</Text>
          </>
        )}
      </View>
      <View style={styles.buttonsContainer}>
        <CustomButton
          customStyles={{
            container: {
              ...styles.singleButtonContainer,
              borderColor:
                context === 'monthly' ? COLORS.SECONDARY : 'transparent'
            }
          }}
          onPress={handleContextChange('monthly')}
          title={t('currentMonth')}
        />
        <CustomButton
          customStyles={{
            container: {
              ...styles.singleButtonContainer,
              borderColor:
                context === 'all-time' ? COLORS.SECONDARY : 'transparent'
            }
          }}
          onPress={handleContextChange('all-time')}
          title={t('allTime')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
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
    borderRadius: 15,
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
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 2,
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
