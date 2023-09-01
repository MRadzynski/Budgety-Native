import { COLORS } from '../../styles/Colors';
import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import CategoryListItem from '../../components/CategoryListItem/CategoryListItem';
import Title from '../../components/Title/Title';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomModal from '../../components/CustomModal/CustomModal';

interface DrawerProps {
  navigation: any;
}

interface ICategoryListItem {
  amount: number;
  bgColor: string;
  iconName: string;
  name: string;
}

const TEMP_DATA_EXPENSES = [
  {
    amount: 10.54,
    bgColor: 'red',
    iconName: 'Health',
    name: 'Health'
  },
  {
    amount: 22.54,
    bgColor: 'green',
    iconName: 'Food',
    name: 'Food'
  },
  {
    amount: 43.54,
    bgColor: 'blue',
    iconName: 'Clothes',
    name: 'Clothes'
  },
  {
    amount: 980.54,
    bgColor: 'orange',
    iconName: 'House',
    name: 'House'
  },
  {
    amount: 120.54,
    bgColor: 'yellow',
    iconName: 'Car',
    name: 'Car'
  },
  {
    amount: 150.54,
    bgColor: 'purple',
    iconName: 'Bills',
    name: 'Bills'
  },
  {
    amount: 130.54,
    bgColor: 'grey',
    iconName: 'Gas',
    name: 'Gas'
  },
  {
    amount: 1800.54,
    bgColor: 'white',
    iconName: 'Other',
    name: 'Other'
  }
];

const TEMP_DATA_INCOME = [
  {
    amount: 110.54,
    bgColor: 'green',
    iconName: 'Health',
    name: 'Health'
  },
  {
    amount: 2232.54,
    bgColor: 'blue',
    iconName: 'Food',
    name: 'Food'
  },
  {
    amount: 4433.54,
    bgColor: 'red',
    iconName: 'Clothes',
    name: 'Clothes'
  },
  {
    amount: 9830.54,
    bgColor: 'orange',
    iconName: 'House',
    name: 'House'
  },
  {
    amount: 120.54,
    bgColor: 'yellow',
    iconName: 'Car',
    name: 'Car'
  },
  {
    amount: 150.54,
    bgColor: 'purple',
    iconName: 'Bills',
    name: 'Bills'
  },
  {
    amount: 130.54,
    bgColor: 'grey',
    iconName: 'Gas',
    name: 'Gas'
  },
  {
    amount: 1800.54,
    bgColor: 'white',
    iconName: 'Other',
    name: 'Other'
  }
];

const CONTEXT = {
  EXPENSES: 'EXPENSES',
  INCOME: 'INCOME'
};

const ExpensesIncomeScreen = ({ navigation }: DrawerProps) => {
  const [context, setContext] = useState(CONTEXT.EXPENSES);
  const [isModalShown, setIsModalShown] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Title
          customStyles={{
            container: styles.titleContainer,
            content: styles.titleContent
          }}
          text={context === CONTEXT.EXPENSES ? 'Expenses' : 'Income'}
        />
        <View style={styles.chartContainer}></View>
      </View>
      <View style={styles.bodyContainer}>
        <CustomModal
          isVisible={isModalShown}
          message="You are about to delete the ... category."
          onConfirm={() => console.log('deleted')}
          setIsVisible={setIsModalShown}
        />
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setContext(CONTEXT.EXPENSES)}
            style={[
              styles.tab,
              context === CONTEXT.EXPENSES ? styles.activeTab : {}
            ]}
          >
            <Text
              style={[
                styles.tabText,
                context === CONTEXT.EXPENSES ? styles.activeTabText : {}
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setContext(CONTEXT.INCOME)}
            style={[
              styles.tab,
              context === CONTEXT.INCOME ? styles.activeTab : {}
            ]}
          >
            <Text
              style={[
                styles.tabText,
                context === CONTEXT.INCOME ? styles.activeTabText : {}
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryListContainer}>
          <FlatList
            data={
              context === CONTEXT.EXPENSES
                ? TEMP_DATA_EXPENSES
                : TEMP_DATA_INCOME
            }
            renderItem={({ item }: { item: ICategoryListItem }) => (
              <CategoryListItem
                amount={item.amount}
                bgColor={item.bgColor}
                iconName={item.iconName}
                name={item.name}
                setIsModalShown={setIsModalShown}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activeTab: {
    borderTopColor: COLORS.PRIMARY
  },
  activeTabText: {
    color: COLORS.PRIMARY
  },
  bodyContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flex: 6
  },
  categoryListContainer: {
    flex: 1,
    // marginBottom: 32,
    marginTop: 16,
    paddingHorizontal: 32
  },
  chartContainer: {
    backgroundColor: 'white',
    flex: 6
  },
  container: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1
  },
  headerContainer: {
    flex: 4,
    flexDirection: 'row',
    paddingBottom: 16,
    paddingHorizontal: 24
  },
  tab: {
    alignItems: 'center',
    borderTopColor: 'transparent',
    borderTopWidth: 2,
    marginTop: 6,
    maxWidth: 130,
    minWidth: 130
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-evenly'
  },
  tabText: {
    color: COLORS.BLACK_SHADE,
    fontSize: 20,
    paddingTop: 4
  },
  titleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 4
  },
  titleContent: {
    fontSize: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 1,
    top: '20%'
  }
});

export default ExpensesIncomeScreen;
