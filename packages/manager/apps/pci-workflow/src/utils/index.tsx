export const groupBy = <T, K>(array: T[], getValue: (item: T) => K) => {
  return array.reduce((acc, item) => {
    const value = getValue(item);
    acc.set(value, (acc.get(value) || []).concat(item));
    return acc;
  }, new Map<K, T[]>());
};
