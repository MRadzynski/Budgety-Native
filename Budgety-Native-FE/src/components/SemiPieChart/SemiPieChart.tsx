import { PieChart, PieChartSelectEvent } from 'react-native-charts-wrapper';
import { processColor, StyleProp, ViewStyle } from 'react-native';
import { useAppSelector } from '../../hooks/redux';

interface Props {
  chartStyles?: StyleProp<ViewStyle>;
  data: {
    color: string;
    name: string;
    value: number;
  }[];
  label: string;
  onSelectHandler: (event: PieChartSelectEvent) => void;
}

const CURRENCIES_SIGNS = {
  AUD: 'A$',
  BGN: 'BGN',
  BRL: 'R$',
  CAD: 'CA$',
  CHF: 'CHF',
  CNY: 'CN¥',
  CZK: 'CZK',
  DKK: 'DKK',
  EUR: '€',
  GBP: '£',
  HKD: 'HK$',
  HUF: 'HUF',
  IDR: 'IDR',
  ILS: '₪',
  INR: '₹',
  ISK: 'ISK',
  JPY: '¥',
  KRW: '₩',
  MXN: 'MX$',
  MYR: 'MYR',
  NOK: 'NOK',
  NZD: 'NZ$',
  PHP: '₱',
  PLN: 'PLN',
  RON: 'RON',
  SEK: 'SEK',
  SGD: 'SGD',
  THB: 'THB',
  TRY: 'TRY',
  USD: '$',
  ZAR: 'ZAR'
} as const;

const SemiPieChart = ({ chartStyles, data, label, onSelectHandler }: Props) => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  return (
    <PieChart
      chartDescription={{ text: '' }}
      data={{
        dataSets: [
          {
            config: {
              colors: data.map(({ color }) => processColor(color)),
              sliceSpace: 2,
              valueFormatter: `${
                'currency' in currentUser
                  ? CURRENCIES_SIGNS[
                      currentUser.currency as keyof typeof CURRENCIES_SIGNS
                    ]
                  : '$'
              }0.00`,
              valueLineColor: processColor('#999999aa'),
              valueLinePart2Length: 0,
              valueTextSize: 11,
              yValuePosition: 'OUTSIDE_SLICE'
            },
            label,
            values: data.map(({ name, value }) => ({ label: name, value }))
          }
        ]
      }}
      drawEntryLabels={false}
      holeColor={processColor('#00000000')}
      holeRadius={75}
      legend={{ enabled: false }}
      maxAngle={180}
      onSelect={onSelectHandler}
      rotationAngle={180}
      rotationEnabled={false}
      style={chartStyles}
    />
  );
};

export default SemiPieChart;
