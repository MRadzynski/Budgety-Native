import { COLORS } from '../../styles/Colors';
import { formatNumber } from '../../utils/helpers';
import { LANGUAGES_LOCALES } from '../../data/constants';
import { PieChart } from 'react-native-charts-wrapper';
import {
  processColor,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { useAppSelector } from '../../hooks/redux';
import { useMemo } from 'react';

interface Props {
  centerValue?: string;
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
  const currentUser = useAppSelector(state => state.user.currentUser);

  const HAS_AT_LEAST_ONE_VALUE_ADDED = useMemo(
    () => data.some(({ value }) => value > 0),
    [data]
  );

  return (
    <View style={[containerStyles, { position: 'relative' }]}>
      <PieChart
        chartDescription={{ text: '' }}
        data={{
          dataSets: [
            {
              config: {
                colors: HAS_AT_LEAST_ONE_VALUE_ADDED
                  ? data.map(({ color }) => processColor(color))
                  : [processColor('#ffffffee')],
                drawValues: false,
                sliceSpace: 3
              },
              label,
              values: HAS_AT_LEAST_ONE_VALUE_ADDED
                ? data.map(({ name, value }) => ({ label: name, value }))
                : [{ label: 'defaultName', value: 1 }]
            }
          ]
        }}
        drawEntryLabels={false}
        highlightPerTapEnabled={false}
        holeColor={processColor(COLORS.PRIMARY)}
        holeRadius={60}
        legend={{ enabled: false }}
        maxAngle={360}
        rotationEnabled={false}
        style={{ flex: 1 }}
      />
      {centerValue && (
        <View style={styles.centerValueContainer}>
          <Text style={styles.centerValueText}>
            {formatNumber(
              Number(centerValue),
              currentUser && 'currency' in currentUser
                ? currentUser.currency
                : 'USD',
              'language' in currentUser
                ? LANGUAGES_LOCALES[
                    currentUser.language as keyof typeof LANGUAGES_LOCALES
                  ]
                : LANGUAGES_LOCALES['EN']
            )}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerValueContainer: {
    alignItems: 'center',
    borderRadius: 100,
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
