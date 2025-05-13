export function debug(...args: any[]) {
  if (
    !window.test && // temporarily  fix jest bug
    window.localStorage?.getItem('MANAGER_TRACKING_DEBUG')
  ) {
    console.debug(...args);
  }
}

/**
 * Replacement of `isEmpty` function from `lodash`.
 * Checks if value is an empty object, collection, map, or set.
 * @param {any} obj - the object, collection map or set to check.
 * @return {boolean} wether or not it is empty.
 */
export const isEmpty = (obj: any) => {
  if (obj?.length || obj?.size) return false;
  if (typeof obj !== 'object') return true;
  return !Object.values(obj).length;
};

/**
 * Replacement of `capitalize` function from `lodash`.
 * Capitalize the first character of a string, and lowercase the rest.
 * @param {string} str - string to capitalize.
 * @return {string} capitalized string
 */
export const capitalize = (str: string): string => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
};

/**
 * Replacement of `mapValues` function from `lodash`.
 * Maps over values of an object, applies a predicate and return a new object
 * from the result.
 * @param {object} obj - the object to map values over.
 * @param {function} fn - the predicate to run on each value of the object.
 * @return {object} new object from the iterations
 */
export const mapValues = (
  obj: Record<string, unknown>,
  fn: (val: unknown, key: string, obj: Record<string, unknown>) => unknown,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, fn(val, key, obj)]),
  );

export const getRandomString = (len: number): string => {
  const alphabet =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return new Array(len)
    .map(() => alphabet.charAt(Math.floor(Math.random() * alphabet.length)))
    .join('');
};

/**
 * Returns an unique ID (used by orders and carts)
 * To ensure that the ID is unique, we generate it from current milliseconds
 * and concat a random string to avoid any collisions.
 */
export const getUniqueId = (): string => {
  // unique key : current milliseconds in base 36 concatenated with 8 random chars
  return new Date().valueOf().toString(36) + getRandomString(8);
};
