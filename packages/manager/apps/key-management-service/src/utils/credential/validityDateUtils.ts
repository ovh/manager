export function getNextMonth(): Date {
  const today = new Date();
  today.setMonth(today.getMonth() + 1);
  return today;
}

export function getDaysFromDate(date: Date): number {
  const referenceDate: Date = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const diffInTime = date.getTime() - referenceDate.getTime();
  const diffInDays = Math.floor(diffInTime / oneDay);
  return diffInDays;
}
