import { COLORS } from '../../styles/Colors';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import ScrollableBarChart from '../ScrollableBarChart/ScrollableBarChart';

interface IProps {
  title: string;
}

const EXPENSES_MOCK_DATA = [
  {
    color: '#497E76',
    name: 'Food',
    value: 12.67
  },
  {
    color: '#6D3F5B',
    name: 'Bills',
    value: 22.32
  },
  {
    color: '#E6D690',
    name: 'Water',
    value: 54.3
  },
  {
    color: '#D95030',
    name: 'Clothes',
    value: 7.67
  },
  {
    color: '#FF7514',
    name: 'Electricity',
    value: 32.67
  },
  {
    color: '#FE0000',
    name: 'Gifts',
    value: 13.67
  },
  {
    color: '#A18594',
    name: 'Work',
    value: 4.67
  },
  {
    color: '#FAD201',
    name: 'Entertainment',
    value: 9.67
  },
  {
    color: '#3B83BD',
    name: 'Gas',
    value: 31.67
  },
  {
    color: '#DE4C8A',
    name: 'Family',
    value: 17.67
  }
];

const INCOME_MOCK_DATA = [
  {
    color: '#354D73',
    name: 'Job',
    value: 15.67
  },
  {
    color: '#1C542D',
    name: 'Additional Job',
    value: 17.32
  },
  {
    color: '#A2231D',
    name: 'Gifts',
    value: 33.3
  },
  {
    color: '#CDA434',
    name: 'Sales',
    value: 7.67
  },
  {
    color: '#2C5545',
    name: 'Charity',
    value: 32.67
  },
  {
    color: '#256D7B',
    name: 'Consulting',
    value: 23.67
  },
  {
    color: '#E63244',
    name: 'Rewards',
    value: 10.43
  }
];

const TEMP_EXPENSES_BALANCE = 23435.56;

const TEMP_INCOME_BALANCE = 16595.76;

const TEMP_BALANCE = TEMP_EXPENSES_BALANCE - TEMP_INCOME_BALANCE;

const HistoryTab = ({ title }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsOpen(prev => !prev)}
        style={[
          styles.tabContainer,
          {
            borderBottomLeftRadius: isOpen ? 0 : 8,
            borderBottomRightRadius: isOpen ? 0 : 8
          }
        ]}
      >
        <Entypo
          color={COLORS.PRIMARY}
          name="chevron-right"
          size={16}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <Text style={styles.tabTitle}>{title}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.tabContent}>
          <View>
            <Text
              style={styles.chartTitle}
            >{`Expenses: $${TEMP_EXPENSES_BALANCE}`}</Text>
            <ScrollableBarChart
              containerStyles={styles.barChartContainer}
              data={EXPENSES_MOCK_DATA}
              label="Expenses"
            />
          </View>
          <View>
            <Text
              style={styles.chartTitle}
            >{`Income: $${TEMP_INCOME_BALANCE}`}</Text>
            <ScrollableBarChart
              containerStyles={styles.barChartContainer}
              data={INCOME_MOCK_DATA}
              label="Income"
            />
          </View>
          <Text style={styles.chartTitle}>{`Balance: $${TEMP_BALANCE.toFixed(
            2
          )}`}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  barChartContainer: {
    height: 140,
    marginTop: -8
  },
  chartTitle: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    textAlign: 'center'
  },
  tabContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    height: 40,
    marginTop: 16,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  tabContent: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  tabTitle: {
    color: COLORS.PRIMARY,
    fontSize: 14
  }
});

export default HistoryTab;
