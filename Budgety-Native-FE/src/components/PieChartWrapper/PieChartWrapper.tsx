import { PieChart } from 'react-native-charts-wrapper';
import {
  processColor,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';

interface Props {
  centerValue?: number;
  containerStyles?: StyleProp<ViewStyle>;
  data: {
    color: string;
    name: string;
    value: number;
  }[];
  label: string;
}

const PieChartWrapper = ({
  centerValue,
  containerStyles,
  data,
  label
}: Props) => {
  return (
    <View style={[containerStyles, { position: 'relative' }]}>
      <PieChart
        chartDescription={{ text: '' }}
        data={{
          dataSets: [
            {
              config: {
                colors: data.map(({ color }) => processColor(color)),
                drawValues: false,
                sliceSpace: 3
              },
              label,
              values: data.map(({ name, value }) => ({ label: name, value }))
            }
          ]
        }}
        drawEntryLabels={false}
        highlightPerTapEnabled={false}
        holeColor={processColor('#00000015')}
        holeRadius={60}
        legend={{ enabled: false }}
        maxAngle={360}
        rotationEnabled={false}
        style={{ flex: 1 }}
      />
      {centerValue && (
        <View style={styles.centerValueContainer}>
          <Text style={styles.centerValueText}>
            {new Intl.NumberFormat('en-US', {
              currency: 'USD',
              style: 'currency'
            }).format(centerValue)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerValueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'absolute',
    width: '100%'
  },
  centerValueText: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 8,
    fontSize: 20,
    paddingHorizontal: 8,
    paddingVertical: 4
  }
});

export default PieChartWrapper;
