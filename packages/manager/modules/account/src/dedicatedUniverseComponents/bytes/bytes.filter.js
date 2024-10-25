import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';

export default /* @ngInject */ ($translate) => {
  // TODO: Add this filter in UX components
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const unitsKibi = [
    'B',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  function translateUnit(unit) {
    const key = `unit_size_${unit}`;
    const translatedUnit = $translate.instant(key);

    // if translation is not found use the default unit
    return key === translatedUnit ? unit : translatedUnit;
  }

  const translatedUnits = map(units, translateUnit);
  const translatedUnitsKibi = map(unitsKibi, translateUnit);

  function setDefaults(_options) {
    let options = _options;
    if (isUndefined(options)) {
      options = {};
    }
    options.precision = get(options, 'precision', 0);
    options.toKibi = get(options, 'toKibi', false);
    options.fromUnit = get(options, 'fromUnit', null);
    options.toUnit = get(options, 'toUnit', null);
    options.toFormat = get(options, 'toFormat', 'text');
    return options;
  }

  function getIndexFromUnit(unit) {
    const fromUnitIndex = indexOf(units, unit);
    const fromTranslatedUnitIndex = indexOf(translatedUnits, unit);
    const fromKibiUnitIndex = indexOf(unitsKibi, unit);
    const fromTranslatedKibiUnitIndex = indexOf(translatedUnitsKibi, unit);

    let index = -1;
    let isKibi = false;

    if (fromUnitIndex > -1) {
      index = fromUnitIndex;
      isKibi = false;
    } else if (fromTranslatedUnitIndex > -1) {
      index = fromTranslatedUnitIndex;
      isKibi = false;
    } else if (fromKibiUnitIndex > -1) {
      index = fromKibiUnitIndex;
      isKibi = true;
    } else if (fromTranslatedKibiUnitIndex > -1) {
      index = fromTranslatedKibiUnitIndex;
      isKibi = true;
    }

    return {
      index,
      isKibi,
    };
  }

  function fromUnitToBytes(_bytes, fromUnit) {
    let bytes = _bytes;
    const index = getIndexFromUnit(fromUnit);
    if (index.index > 0) {
      /* eslint-disable no-restricted-properties */
      bytes *= Math.pow(index.isKibi ? 1024 : 1000, index.index);
      /* eslint-enable no-restricted-properties */
    } else if (index.index === -1) {
      return '?';
    }
    return bytes;
  }

  function getNumber(bytes, toKibi, toUnit, divider) {
    let number = null;
    if (bytes === 0) {
      number = 0;
    }
    if (toUnit) {
      const index = getIndexFromUnit(toUnit);
      if (index.index) {
        if ((index.isKibi && !toKibi) || (!index.isKibi && toKibi)) {
          return null;
        }
        number = index.index;
      }
    }
    if (isNull(number) || number === -1) {
      number = Math.floor(Math.log(bytes) / Math.log(divider));
    }
    return number;
  }

  function setToText(value, toKibi, number) {
    return `${value} ${
      toKibi ? translatedUnitsKibi[number] : translatedUnits[number]
    }`;
  }

  function setToFormat(toFormat, value, toKibi, number) {
    if (toFormat === 'value') {
      return value;
    }
    if (toFormat === 'object') {
      return {
        value,
        unit: toKibi ? translatedUnitsKibi[number] : translatedUnits[number],
        nonTranslatedUnit: toKibi ? unitsKibi[number] : units[number],
        text: setToText(value, toKibi, number),
      };
    }
    if (toFormat === 'text') {
      return setToText(value, toKibi, number);
    }
    return null;
  }

  return function bytesFilter(_bytes, _options) {
    let bytes = _bytes;
    let options = _options;
    options = setDefaults(options);

    if (options.fromUnit) {
      bytes = fromUnitToBytes(bytes, options.fromUnit);
    }

    if (Number.isNaN(parseFloat(bytes)) || !Number.isFinite(bytes)) {
      return '?';
    }

    const divider = options.toKibi ? 1024 : 1000;
    const number = getNumber(bytes, options.toKibi, options.toUnit, divider);

    if (isNull(number)) {
      return '?';
    }

    if (bytes === 0) {
      return setToFormat(options.toFormat, 0, options.toKibi, number);
    }

    /* eslint-disable no-restricted-properties */
    let value = (bytes / Math.pow(divider, Math.floor(number))).toFixed(
      options.precision,
    );
    /* eslint-enable no-restricted-properties */

    if (/\.0+$/.test(value)) {
      value = value.replace(/\.0+$/, '');
    }

    return setToFormat(options.toFormat, value, options.toKibi, number);
  };
};
