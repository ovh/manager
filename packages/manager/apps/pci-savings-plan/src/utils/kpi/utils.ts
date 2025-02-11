export const getPercentValue = (percentValues: string[]): number => {
  if (!percentValues || percentValues.length === 0) return 0;

  const validValues = percentValues
    .map((value) => parseFloat(value.replace('%', '')))
    .filter((value) => !Number.isNaN(value));

  if (validValues.length === 0) return 0;

  const average =
    validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
  return Math.floor(average);
};

export const isCurrentPeriod = (period: Date): boolean => {
  const now = new Date();
  const periodDate = new Date(period);

  if (Number.isNaN(periodDate.getTime())) {
    return false;
  }

  return (
    periodDate.getFullYear() === now.getFullYear() &&
    periodDate.getMonth() === now.getMonth()
  );
};
