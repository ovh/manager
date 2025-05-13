import { BINARY_BASE, SI_BASE, UNITS } from './constants';

/**
 * @param {number}  value     Unit value to convert
 * @param {boolean} toBinary  Determines if the convertion will use binary base
 * @param {number}  precision Decimal precision
 */
export function convertUnit(value, toBinary = false, precision = 0) {
  const divider = toBinary ? BINARY_BASE : SI_BASE;
  const multiple = Math.floor(Math.log(value) / Math.log(divider));

  const convertedValue = (value / divider ** Math.floor(multiple)).toFixed(
    precision,
  );

  return {
    multiple,
    value: parseFloat(convertedValue),
  };
}

/**
 * @param {string}  fromUnit Unit from which we converted the value
 * @param {number}  value    Value to transform
 * @param {boolean} toBinary Determines if we convert from SI or binary system
 */
export function getValueFromUnit(fromUnit, value, toBinary = false) {
  const fromUnitIndex = UNITS.indexOf(fromUnit);
  const multiplier = toBinary ? BINARY_BASE : SI_BASE;

  if (fromUnitIndex > 0) {
    return value * multiplier ** fromUnitIndex;
  }

  return value;
}

export default {
  convertUnit,
  getValueFromUnit,
};
