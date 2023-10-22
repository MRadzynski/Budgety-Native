import { COLORS } from '../../styles/Colors';
import { ScrollView, StyleSheet, View } from 'react-native';
import HistoryTab from '../../components/HistoryTab/HistoryTab';
import Title from '../../components/Title/Title';

interface DrawerProps {
  navigation: any;
}

const HistoryScreen = ({ navigation }: DrawerProps) => {
  return (
    <View style={styles.container}>
      <View>
        <Title
          customStyles={{
            content: styles.titleContent
          }}
          text="History"
        />
        <Title
          customStyles={{
            content: styles.subTitleContent
          }}
          text="Summary of your previous months"
        />
      </View>
      <ScrollView style={styles.tabsContainer}>
        <HistoryTab title="All Time" />
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

export default HistoryScreen;
