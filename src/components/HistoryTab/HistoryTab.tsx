import { COLORS } from '../../styles/Colors';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

interface IProps {
  title: string;
}

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
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Expenses: </Text>
            <View style={styles.chartContent}></View>
          </View>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Income: </Text>
            <View style={styles.chartContent}></View>
          </View>
          <Text style={styles.chartTitle}>Balance: </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    gap: 8
  },
  chartContent: {
    height: 160
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
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  tabTitle: {
    color: COLORS.PRIMARY,
    fontSize: 14
  }
});

export default HistoryTab;
