import { Platform } from 'react-native';

export const formatDate = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale).format(date);

export const formatNumber = (
  number: number,
  currency: string,
  locale: string
) =>
  new Intl.NumberFormat(locale, {
    currency,
    style: 'currency'
  }).format(number);

export const generateBoxShadowStyle = (
  xOffset: number,
  yOffset: number,
  shadowColor: string,
  shadowOpacity: number,
  shadowRadius: number,
  elevation: number
) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: shadowColor,
      shadowOffset: { width: xOffset, height: yOffset },
      shadowOpacity,
      shadowRadius
    };
  } else if (Platform.OS === 'android') {
    return {
      elevation,
      shadowColor: shadowColor
    };
  }
};

export const getMonthNameByNumber = (monthNumber: string) => {
  const monthNumberAsNumber =
    monthNumber[0] === '0' ? Number(monthNumber[1]) : Number(monthNumber);

  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'Mai',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return MONTHS[monthNumberAsNumber - 1];
};
