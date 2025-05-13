import map from 'lodash/map';
import indexOf from 'lodash/indexOf';

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

  return function bytesFilter(
    bytesParams,
    precisionParam,
    toKibi,
    fromUnit,
    toRawBytes,
  ) {
    let bytes = bytesParams;
    let precision = precisionParam;

    if (fromUnit) {
      const fromKibiUnitIndex = indexOf(unitsKibi, fromUnit);
      const fromUnitIndex = indexOf(units, fromUnit);

      if (fromKibiUnitIndex !== -1) {
        if (fromKibiUnitIndex > 0) {
          // eslint-disable-next-line no-restricted-properties
          bytes *= Math.pow(1024, fromKibiUnitIndex);
        }
      } else if (fromUnitIndex !== -1) {
        if (fromUnitIndex > 0) {
          // eslint-disable-next-line no-restricted-properties
          bytes *= Math.pow(1000, fromUnitIndex);
        }
      } else {
        return '?';
      }
    }

    if (toRawBytes === true) {
      return bytes;
    }

    if (bytes === 0) {
      return '0';
    }
    if (Number.isNaN(parseFloat(bytes)) || !Number.isFinite(bytes)) {
      return '?';
    }
    if (typeof precision === 'undefined') {
      precision = 0;
    }

    const divider = toKibi ? 1024 : 1000;
    const number = Math.floor(Math.log(bytes) / Math.log(divider));

    // eslint-disable-next-line no-restricted-properties
    let value = (bytes / Math.pow(divider, Math.floor(number))).toFixed(
      precision,
    );

    if (/\.0+$/.test(value)) {
      value = value.replace(/\.0+$/, '');
    }

    return `${value} ${
      toKibi ? translatedUnitsKibi[number] : translatedUnits[number]
    }`;
  };
};
