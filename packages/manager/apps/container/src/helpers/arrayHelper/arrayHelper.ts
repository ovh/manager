/**
 * Creates an object composed of keys generated from the results of running each element of an array through mapper.
 * @param array array iterate over
 * @param mapper The function to transform keys.
 * @returns Returns the composed aggregate object.
 */
export function groupBy<
  RetType extends PropertyKey,
  T,
  Func extends (arg: T) => RetType
>(array: T[], mapper: Func): Record<RetType, T[]> {
  return array.reduce((result, item) => {
    const groupKey = mapper(item);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<RetType, T[]>);
}
