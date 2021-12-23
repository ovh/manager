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
