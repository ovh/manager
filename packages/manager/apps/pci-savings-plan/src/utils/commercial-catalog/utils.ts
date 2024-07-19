export const convertToPrice = (price: number) => price / 100000000;

export const convertHourlyPriceToMonthly = (price: number) => price * 720;

export const convertToDuration = (duration: string) =>
  duration.replace('P', '').replace('M', '');
