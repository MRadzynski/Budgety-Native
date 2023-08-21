export const formatNumber = (number: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(number);
