import { COLORS } from '../../styles/Colors';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import CategoryForm from '../../components/CategoryForm/CategoryForm';
import CategoryListItem from '../../components/CategoryListItem/CategoryListItem';
import CustomModal from '../../components/CustomModal/CustomModal';
import Title from '../../components/Title/Title';

interface DrawerProps {
  navigation: any;
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

  const route = useRoute();

  const handleEditCategory = () => {
    navigation.navigate('EditCategory');
  };

  return (
    <View style={styles.container}>
      {/* // <KeyboardAwareScrollView
    //   style={{
    //     backgroundColor: COLORS.PRIMARY
    //   }}
    //   extraScrollHeight={200}
    //   enableOnAndroid={true}
    //   scrollEnabled={false}
    //   resetScrollToCoords={{ x: 0, y: 0 }}
    //   contentContainerStyle={{
    //     backgroundColor: COLORS.PRIMARY,
    //     // flexGrow: 1
    //     flex: 1
    //     // justifyContent: 'center'
    //   }}
    // > */}
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
        {route.name !== 'EditCategory' ? (
          <>
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
            <ScrollView style={styles.categoryListContainer}>
              {TEMP_DATA_EXPENSES.map(item => (
                <CategoryListItem
                  amount={item.amount}
                  bgColor={item.bgColor}
                  handleEditCategory={handleEditCategory}
                  iconName={item.iconName}
                  key={item.name}
                  name={item.name}
                  setIsModalShown={setIsModalShown}
                />
              ))}
            </ScrollView>
          </>
        ) : (
          <CategoryForm type="EDIT" navigation={navigation} />
        )}
      </View>
      {/* </KeyboardAwareScrollView> */}
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
    height: 300,
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
