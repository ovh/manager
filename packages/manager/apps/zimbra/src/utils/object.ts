export const groupBy = <K extends string | number | symbol, T>(
  arr: T[],
  callback: (item: T) => K,
): Record<K, T[]> => {
  return arr.reduce(
    (acc: Record<K, T[]>, item: T) => {
      const key = callback(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
};
