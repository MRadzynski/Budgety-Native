import { Platform } from 'react-native';

export const formatNumber = (number: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
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
