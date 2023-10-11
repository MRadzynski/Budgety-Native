import { BarChart, PieChart } from 'react-native-charts-wrapper';
import { COLORS } from '../../styles/Colors';
import { processColor, ScrollView, StyleSheet, Text, View } from 'react-native';

interface DrawerProps {
  navigation: any;
}

const TEMP_BALANCE = 12322.45;

const HomeScreen = ({ navigation }: DrawerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hey User! 👋</Text>
      <View style={styles.section}>
        <View style={styles.chartContainer}>
          <PieChart
            chartDescription={{ text: '' }}
            data={{
              dataSets: [
                {
                  config: {
                    colors: [processColor('#4BB543'), processColor('#ED4337')],
                    sliceSpace: 2,
                    valueFormatter: '$#.#',
                    valueLineColor: processColor('#999999aa'),
                    valueLinePart2Length: 0,
                    valueTextSize: 12,
                    yValuePosition: 'OUTSIDE_SLICE'
                  },
                  label: 'Balance',
                  values: [
                    { label: 'Expenses', value: 6248 },
                    { label: 'Income', value: 3752 }
                  ]
                }
              ]
            }}
            drawEntryLabels={false}
            holeColor={processColor('#00000000')}
            holeRadius={75}
            legend={{ enabled: false }}
            maxAngle={180}
            rotationAngle={180}
            rotationEnabled={false}
            style={styles.chart}
          />
        </View>
        <Text style={styles.balanceText}>{`Balance: $${TEMP_BALANCE}`}</Text>
      </View>
      <View style={styles.section}>
        <ScrollView
          contentContainerStyle={styles.barChartContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <BarChart
            chartDescription={{ text: '' }}
            data={{
              config: {
                barWidth: 0.9
              },
              dataSets: [
                {
                  config: {
                    colors: [
                      processColor('red'),
                      processColor('blue'),
                      processColor('green'),
                      processColor('purple'),
                      processColor('orange'),
                      processColor('yellow'),
                      processColor('lime'),
                      processColor('brown'),
                      processColor('black'),
                      processColor('magenta')
                    ],
                    drawValues: false
                  },
                  label: 'Expenses',
                  values: [
                    { y: 12 },
                    { y: 18 },
                    { y: 43 },
                    { y: 14 },
                    { y: 65 },
                    { y: 34 },
                    { y: 4 },
                    { y: 21 },
                    { y: 54 },
                    { y: 2 }
                  ]
                }
              ]
            }}
            doubleTapToZoomEnabled={false}
            drawValueAboveBar={false}
            legend={{ enabled: false }}
            pinchZoom={false}
            style={{ width: 600 }}
            xAxis={{
              labelCount: 10,
              granularity: 1,
              position: 'BOTTOM',
              valueFormatter: [
                'Food',
                'Bills',
                'Water',
                'Clothes',
                'Electricity',
                'Gifts',
                'Work',
                'Entertainment',
                'Gas',
                'Family',
                'Animals'
              ]
            }}
            yAxis={{
              left: {
                valueFormatter: 'percent'
              },
              right: { enabled: false }
            }}
          />
        </ScrollView>
        <Text style={styles.sectionValueText}>Expenses</Text>
      </View>
      <View style={styles.section}>
        <ScrollView
          contentContainerStyle={styles.barChartContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <BarChart
            chartDescription={{ text: '' }}
            data={{
              config: {
                barWidth: 0.9
              },
              dataSets: [
                {
                  config: {
                    colors: [
                      processColor('green'),
                      processColor('orange'),
                      processColor('red'),
                      processColor('magenta'),
                      processColor('pink'),
                      processColor('blue'),
                      processColor('seagreen')
                    ],
                    drawValues: false
                  },
                  label: 'Expenses',
                  values: [
                    { y: 12 },
                    { y: 18 },
                    { y: 43 },
                    { y: 14 },
                    { y: 24 },
                    { y: 4 },
                    { y: 65 }
                  ]
                }
              ]
            }}
            doubleTapToZoomEnabled={false}
            drawValueAboveBar={false}
            legend={{ enabled: false }}
            pinchZoom={false}
            style={{ width: 600 }}
            xAxis={{
              labelCount: 10,
              granularity: 1,
              position: 'BOTTOM',
              valueFormatter: [
                'Job',
                'Additional Job',
                'Gifts',
                'Sales',
                'Charity',
                'Consulting',
                'Rewards'
              ]
            }}
            yAxis={{
              left: {
                valueFormatter: 'percent'
              },
              right: { enabled: false }
            }}
          />
        </ScrollView>
        <Text style={styles.sectionValueText}>Income</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceText: {
    alignSelf: 'center',
    bottom: 8,
    color: TEMP_BALANCE > 0 ? COLORS.SUCCESS : COLORS.ERROR,
    flex: 2,
    fontSize: 22,
    position: 'absolute'
  },
  barChartContainer: {
    height: '80%'
  },
  chart: {
    flex: 9,
    top: 20
  },
  chartContainer: {
    alignSelf: 'center',
    aspectRatio: '1/1',
    height: '110%',
    position: 'relative'
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    gap: 16,
    paddingBottom: 32
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
    flex: 1,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 4 },
    shadowRadius: 5,
    width: '80%'
  },
  sectionValueText: {
    alignSelf: 'center',
    bottom: 8,
    color: COLORS.BLACK_SHADE,
    flex: 2,
    fontSize: 20,
    position: 'absolute',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  welcomeText: {
    alignSelf: 'flex-start',
    color: COLORS.WHITE_SHADE,
    fontSize: 32,
    marginLeft: 36,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 3
  }
});

export default HomeScreen;
