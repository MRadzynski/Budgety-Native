export const isTheSameMonthYear = (dateToCheck: Date) =>
  dateToCheck.getFullYear() === new Date().getFullYear() &&
  dateToCheck.getMonth() === new Date().getMonth();
