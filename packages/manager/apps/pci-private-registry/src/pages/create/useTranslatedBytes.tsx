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

type TTranslatedBytesParam = {
  bytes: number;
  precision?: number;
  toKibi?: boolean;
  fromUnit?: string;
  toRawBytes?: boolean;
};

export const useTranslatedBytes = ({
  bytes,
  precision = 2,
  toKibi = false,
  fromUnit = 'B',
  toRawBytes = false,
}: TTranslatedBytesParam) => {
  let iBytes = bytes;
  let iPrecision = precision;
  if (fromUnit) {
    const fromKibiUnitIndex = KIBI_UNITS.indexOf(
      fromUnit as typeof KIBI_UNITS[number],
      0,
    );
    const fromUnitIndex = UNITS.indexOf(fromUnit as typeof UNITS[number], 0);
    if (fromKibiUnitIndex !== -1) {
      if (fromKibiUnitIndex > 0) {
        // eslint-disable-next-line no-restricted-properties
        iBytes *= Math.pow(1024, fromKibiUnitIndex);
      }
    } else if (fromUnitIndex !== -1) {
      if (fromUnitIndex > 0) {
        // eslint-disable-next-line no-restricted-properties
        iBytes *= Math.pow(1000, fromUnitIndex);
      }
    } else {
      return '?';
    }
  }

  if (toRawBytes) {
    return iBytes;
  }

  if (iBytes === 0) {
    return '0';
  }

  if (Number.isNaN(iBytes) || !Number.isFinite(iBytes)) {
    return '?';
  }
  if (typeof iPrecision === 'undefined') {
    iPrecision = 0;
  }

  const divider = toKibi ? 1024 : 1000;
  const number = Math.floor(Math.log(iBytes) / Math.log(divider));

  // eslint-disable-next-line no-restricted-properties
  let value = (iBytes / Math.pow(divider, Math.floor(number))).toFixed(
    iPrecision,
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
