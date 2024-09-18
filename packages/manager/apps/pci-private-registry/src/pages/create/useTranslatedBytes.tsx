import { useTranslation } from 'react-i18next';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] as const;
const KIBI_UNITS = [
  'B',
  'KiB',
  'MiB',
  'GiB',
  'TiB',
  'PiB',
  'EiB',
  'ZiB',
  'YiB',
] as const;

function translateUnit(unit: string): string {
  const { t } = useTranslation('bytes');
  const key = `unit_size_${unit}`;
  const translatedUnit = t(key);
  // if translation is not found use the default unit
  return key === translatedUnit ? unit : translatedUnit;
}

export const useTranslatedBytes = (
  bytesParams: number,
  precisionParam: number,
  toKibi: boolean,
  fromUnit: string,
  toRawBytes: boolean,
) => {
  let bytes = bytesParams;
  let precision = precisionParam;
  if (fromUnit) {
    const fromKibiUnitIndex = KIBI_UNITS.indexOf(
      fromUnit as typeof KIBI_UNITS[number],
      0,
    );
    const fromUnitIndex = UNITS.indexOf(fromUnit as typeof UNITS[number], 0);
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

  if (toRawBytes) {
    return bytes;
  }

  if (bytes === 0) {
    return '0';
  }

  if (Number.isNaN(bytes) || !Number.isFinite(bytes)) {
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
  const translatedUnits = UNITS.map(translateUnit);
  const translatedUnitsKibi = KIBI_UNITS.map(translateUnit);
  return `${value} ${
    toKibi ? translatedUnitsKibi[number] : translatedUnits[number]
  }`;
};
