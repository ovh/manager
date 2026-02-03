import constantsConfig from './constants.config';

export const getConstants = (region) => {
  return constantsConfig[region];
};
