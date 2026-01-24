import { IntervalUnit } from "@ovh-ux/muk";

export const getPriceUnit = (duration?: string) => {
  switch (duration) {
    case 'P1D':
      return IntervalUnit.day;

    case 'P1M':
      return IntervalUnit.month;

    case 'P12M':
    case 'P1Y':
      return IntervalUnit.year;
    default:
      return IntervalUnit.none;
  }
};
