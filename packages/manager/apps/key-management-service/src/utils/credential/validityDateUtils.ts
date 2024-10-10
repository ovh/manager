export function addDaysToDate(days: number): Date {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  return targetDate;
}

export function getNextMonth(): Date {
  const today = new Date();
  today.setMonth(today.getMonth() + 1);
  return today;
}

export function getDaysFromDate(date: Date): number {
  const referenceDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const diffInTime =
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
    Date.UTC(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate(),
    );
  return Math.floor(diffInTime / oneDay);
}

export function getDateFromDays(days: number): Date {
  const referenceDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const futureDate = new Date(referenceDate.getTime() + days * oneDay);
  return futureDate;
}
