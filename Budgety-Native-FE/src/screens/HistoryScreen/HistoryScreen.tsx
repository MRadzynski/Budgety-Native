import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../hooks/redux';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from '../../hoc/withErrorBoundary';
import HistoryTab from '../../components/HistoryTab/HistoryTab';
import Title from '../../components/Title/Title';

interface DrawerProps {
  navigation: any;
}

interface IHistoryData {
  date: string;
  expenses: {
    amount: number;
    bgColor: string;
    categoryName: string;
  }[];
  income: {
    amount: number;
    bgColor: string;
    categoryName: string;
  }[];
  sumOfExpenses: number;
  sumOfIncome: number;
}

const HistoryScreen = ({ navigation }: DrawerProps) => {
  const [historyData, setHistoryData] = useState<IHistoryData[]>([]);

  const currentUser = useAppSelector(state => state.user.currentUser);

  const { t } = useTranslation();

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
          const url = `${API_URL}/api/finance/get-categories-history`;

          try {
            const response = await fetch(url, options);
            const data = await response.json();

            data.history && setHistoryData(data.history);
          } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message);
          }
        }
      };

      fetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View>
        <Title
          customStyles={{
            content: styles.titleContent
          }}
          text={t('history')}
        />
        <Title
          customStyles={{
            content: styles.subTitleContent
          }}
          text={t('historySubTitle')}
        />
      </View>
      <ScrollView style={styles.tabsContainer}>
        {historyData.map(historyRecord => (
          <HistoryTab data={historyRecord} key={historyRecord.date} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    gap: 16,
    paddingBottom: 32,
    paddingHorizontal: 32
  },
  subTitleContent: {
    color: COLORS.WHITE_SHADE,
    fontSize: 18,
    marginTop: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 1
  },
  tabsContainer: {
    flex: 1
  },
  titleContent: {
    color: COLORS.WHITE_SHADE,
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 1
  }
});

export default withErrorBoundary(HistoryScreen);
