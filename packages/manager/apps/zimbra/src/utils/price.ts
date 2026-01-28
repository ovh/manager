export type Duration = 'P1D' | 'P1M' | 'P12M' | 'P1Y';

export const getPriceUnit = (duration?: Duration) => {
  switch (duration) {
    case 'P1D':
      return 'day';

    case 'P1M':
      return 'month';

    case 'P12M':
    case 'P1Y':
      return 'year';

    default:
      return 'none';
  }
};
