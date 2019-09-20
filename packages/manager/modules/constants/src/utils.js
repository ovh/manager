import filter from 'lodash/filter';
import find from 'lodash/find';
import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';
import keys from 'lodash/keys';
import lowerCase from 'lodash/lowerCase';
import reduce from 'lodash/reduce';
import toPairs from 'lodash/toPairs';

import { FILTER_CHARACTER } from './constants';

const getObjValueCaseInsensitive = (obj, property) => obj[
  find(
    keys(obj),
    key => lowerCase(key) === lowerCase(property),
  )
];

const keepOnlyValidProperties = obj => filter(
  toPairs(obj),
  ([key]) => key !== FILTER_CHARACTER,
);

export const findConstant = (constant, { region, sub }) => {
  const filters = {
    region: obj => getObjValueCaseInsensitive(obj, region),
    sub: obj => getObjValueCaseInsensitive(obj, sub),
  };

  const findValue = filters[constant._];

  return reduce(
    keepOnlyValidProperties(constant),
    (acc, [key, value]) => {
      const foundValue = isObject(value)
        ? findValue(value)
        : value;

      if (foundValue) {
        acc[key] = foundValue;
      }

      return acc;
    },
    {},
  );
};

export const findConstants = (constants, filters) => reduce(
  toPairs(constants),
  (acc, [key, value]) => {
    let foundValue = findConstant(value, filters);

    if (isNil(foundValue)) {
      foundValue = findConstants(value, filters);
    }

    acc[key] = foundValue;

    if (isNil(acc[key])) {
      delete acc[key];
    }

    return acc;
  },
  {},
);

export default {
  findConstant,
  findConstants,
};
