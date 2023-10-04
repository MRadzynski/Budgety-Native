import { COLORS } from '../../styles/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
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
    iconName: 'local-hospital',
    id: '1',
    name: 'Health'
  },
  {
    amount: 22.54,
    bgColor: 'green',
    iconName: 'fastfood',
    id: '2',
    name: 'Food'
  },
  {
    amount: 43.54,
    bgColor: 'blue',
    iconName: 'checkroom',
    id: '3',
    name: 'Clothes'
  },
  {
    amount: 980.54,
    bgColor: 'orange',
    iconName: 'house',
    id: '4',
    name: 'House'
  },
  {
    amount: 120.54,
    bgColor: 'yellow',
    iconName: 'directions-car',
    id: '5',
    name: 'Car'
  },
  {
    amount: 150.54,
    bgColor: 'purple',
    iconName: 'payments',
    id: '6',
    name: 'Bills'
  },
  {
    amount: 130.54,
    bgColor: 'grey',
    iconName: 'local-gas-station',
    id: '7',
    name: 'Gas'
  },
  {
    amount: 1800.54,
    bgColor: 'black',
    iconName: 'more-horiz',
    id: '8',
    name: 'Other'
  }
];

const TEMP_DATA_INCOME = [
  {
    amount: 110.54,
    bgColor: 'green',
    iconName: 'work',
    id: '1',
    name: 'Job'
  },
  {
    amount: 2232.54,
    bgColor: 'blue',
    iconName: 'home-work',
    id: '2',
    name: 'Secondary work'
  },
  {
    amount: 4433.54,
    bgColor: 'red',
    iconName: 'card-giftcard',
    id: '3',
    name: 'Gifts'
  },
  {
    amount: 9830.54,
    bgColor: 'orange',
    iconName: 'person',
    id: '4',
    name: 'Socials'
  },
  {
    amount: 120.54,
    bgColor: 'purple',
    iconName: 'attach-money',
    id: '5',
    name: 'Sale'
  }
];

const CONTEXT = {
  EXPENSES: 'EXPENSES',
  INCOME: 'INCOME'
};

const ExpensesIncomeScreen = ({ navigation }: DrawerProps) => {
  const [categoryToBeRemoved, setCategoryToBeRemoved] = useState('');
  const [context, setContext] = useState(CONTEXT.EXPENSES);
  const [isModalShown, setIsModalShown] = useState(false);

  const route = useRoute();

  useEffect(() => {
    if (!isModalShown && categoryToBeRemoved) setCategoryToBeRemoved('');
  }, [isModalShown]);

  const handleAddCategory = () => {
    navigation.navigate('AddCategory', { context });
  };

  const handleEditCategory = (category: any) => {
    navigation.navigate('EditCategory', {
      categoryData: category,
      context
    });
  };

  const handleRemoveCategory = (categoryName: string) => {
    setCategoryToBeRemoved(categoryName);
    setIsModalShown(true);
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
        {route.name !== 'EditCategory' && route.name !== 'AddCategory' ? (
          <>
            <CustomModal
              isVisible={isModalShown}
              message={`You are about to delete the "${categoryToBeRemoved}" category.`}
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
              {(context === CONTEXT.EXPENSES
                ? TEMP_DATA_EXPENSES
                : TEMP_DATA_INCOME
              ).map(item => (
                <CategoryListItem
                  amount={item.amount}
                  bgColor={item.bgColor}
                  handleEditCategory={() => handleEditCategory(item)}
                  handleRemoveCategory={handleRemoveCategory}
                  iconName={item.iconName}
                  id={item.id}
                  key={item.name}
                  name={item.name}
                />
              ))}
              <TouchableOpacity
                activeOpacity={1}
                onPress={handleAddCategory}
                style={styles.addCategoryContainer}
              >
                <View style={styles.addCategoryIconContainer}>
                  <MaterialIcons color="white" name="add" size={32} />
                </View>
                <View style={styles.addCategoryInfoContainer}>
                  <Text style={styles.addCategoryInfoText}>
                    Add new category
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </>
        ) : (
          <CategoryForm
            navigation={navigation}
            type={route.name === 'EditCategory' ? 'EDIT' : 'ADD'}
          />
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
  addCategoryContainer: {
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
  addCategoryIconContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 50,
    justifyContent: 'center',
    height: 48,
    width: 48
  },
  addCategoryInfoContainer: {
    justifyContent: 'center'
  },
  addCategoryInfoText: {
    fontSize: 16
  },
  bodyContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flex: 6
  },
  categoryListContainer: {
    flex: 1,
    marginVertical: 16,
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
