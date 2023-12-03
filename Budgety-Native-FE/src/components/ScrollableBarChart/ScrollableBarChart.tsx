import { BarChart, ChartSelectEvent } from 'react-native-charts-wrapper';
import {
  Dimensions,
  processColor,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { useAppSelector } from '../../hooks/redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
  containerStyles?: StyleProp<ViewStyle>;
  data: {
    color: string;
    name: string;
    value: number;
  }[];
  label: string;
}

const windowWidth = Dimensions.get('window').width;

const ScrollableBarChart = ({ containerStyles, data, label }: Props) => {
  const [barIndex, setBarIndex] = useState<number | undefined>();
  const [coords, setCoords] = useState({
    left: 40,
    top: 30
  });

  const currentUser = useAppSelector(state => state.user.currentUser);

  useFocusEffect(
    useCallback(() => {
      return () => setBarIndex(undefined);
    }, [])
  );

  useEffect(() => {
    if (barIndex !== undefined) {
      let left = barIndex * 65;
      if (barIndex === 0) left = 40;
      if (barIndex === data.length - 1 && data.length > 1)
        left = barIndex * 65 - 50;

      if (data.length < 5) left = barIndex * 60;
      if (data.length < 4) left = barIndex * 90;
      if (data.length < 3) left = barIndex * 120;
      if (data.length < 2) left = 100;

      if (barIndex === data.length - 1 && data.length < 5)
        left = windowWidth - 230;
      if (barIndex === data.length - 1 && data.length >= 5)
        left = barIndex * 65 - 50 - 70;

      setCoords({
        left,
        top: 30
      });
    }
  }, [barIndex]);

  const handleSelect = (e: ChartSelectEvent) => {
    const index = e.nativeEvent?.x;
    if (index === undefined) setBarIndex(undefined);

    setBarIndex(index);
  };

  const SUM_OF_ALL_DATA = useMemo(
    () => data?.reduce((acc, record) => acc + record.value, 0) || 0,
    [data]
  );

  return (
    <ScrollView
      contentContainerStyle={containerStyles}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {barIndex !== undefined && (
        <View
          style={[
            styles.tooltipContainer,
            {
              left: coords.left,
              minWidth: data[barIndex].value.toString().length * 10 + 20,
              top: coords.top
            }
          ]}
        >
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.tooltipHeader}
          >
            {data[barIndex].name}
          </Text>
          <Text style={styles.tooltipValue}>{`Percent: ${(
            (data[barIndex].value / SUM_OF_ALL_DATA) *
            100
          ).toFixed(2)}%`}</Text>
          <Text style={styles.tooltipValue}>{`Value: ${new Intl.NumberFormat(
            'en-US',
            {
              currency:
                'currency' in currentUser ? currentUser.currency : 'USD',
              style: 'currency'
            }
          ).format(data[barIndex].value)}`}</Text>
        </View>
      )}
      <BarChart
        chartDescription={{ text: '' }}
        data={{
          config: {
            barWidth: data.length < 5 ? 100 / windowWidth : 0.8
          },
          dataSets: [
            {
              config: {
                colors: data.map(({ color }) => processColor(color)),
                drawValues: false
              },
              label,
              values: data.map(({ value }) => ({
                y: (value / SUM_OF_ALL_DATA) * 100
              }))
            }
          ]
        }}
        doubleTapToZoomEnabled={false}
        drawValueAboveBar={false}
        legend={{ enabled: false }}
        onSelect={handleSelect}
        pinchZoom={false}
        style={{ width: data.length < 5 ? windowWidth - 70 : data.length * 65 }}
        xAxis={{
          granularity: 1,
          labelCount: data.length,
          position: 'BOTTOM',
          textColor: processColor('black'),
          valueFormatter: data.map(({ name }) => name)
        }}
        yAxis={{
          left: {
            // valueFormatter: 'percent',
            textColor: processColor('black'),
            valueFormatter: "#.#'%'"
          },
          right: { enabled: false }
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  tooltipContainer: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    maxWidth: 150,
    padding: 6,
    position: 'absolute',
    zIndex: 1
  },
  tooltipHeader: {
    fontSize: 13
  },
  tooltipValue: {
    fontSize: 11
  }
});

export default ScrollableBarChart;
