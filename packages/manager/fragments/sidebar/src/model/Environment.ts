export interface Environment {
  getUserLocale: () => string,
  getUniverse: () => string
}

export default Environment;
