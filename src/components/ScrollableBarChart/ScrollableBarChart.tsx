import { BarChart } from 'react-native-charts-wrapper';
import { processColor, ScrollView, StyleProp, ViewStyle } from 'react-native';

interface Props {
  containerStyles?: StyleProp<ViewStyle>;
  data: {
    color: string;
    name: string;
    value: number;
  }[];
  label: string;
}

const ScrollableBarChart = ({ containerStyles, data, label }: Props) => {
  return (
    <ScrollView
      contentContainerStyle={containerStyles}
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
                colors: data.map(({ color }) => processColor(color)),
                drawValues: false
              },
              label,
              values: data.map(({ value }) => ({ y: value }))
            }
          ]
        }}
        doubleTapToZoomEnabled={false}
        drawValueAboveBar={false}
        legend={{ enabled: false }}
        pinchZoom={false}
        style={{ width: data.length * 65 }}
        xAxis={{
          labelCount: data.length,
          granularity: 1,
          position: 'BOTTOM',
          valueFormatter: data.map(({ name }) => name)
        }}
        yAxis={{
          left: {
            valueFormatter: 'percent'
          },
          right: { enabled: false }
        }}
      />
    </ScrollView>
  );
};

export default ScrollableBarChart;
