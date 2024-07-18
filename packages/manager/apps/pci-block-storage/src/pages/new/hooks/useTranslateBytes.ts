import { useTranslation } from 'react-i18next';

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const kibiUnits = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

export const useTranslateBytes = () => {
  const { t } = useTranslation('bytes');

  const innerTranslate = (unit: string) => {
    const [key, value] = [`unit_size_${unit}`, t(`unit_size_${unit}`)];
    return key === value ? unit : value;
  };

  const [tUnits, tKibiUnits] = [
    units.map(innerTranslate),
    kibiUnits.map(innerTranslate),
  ];

  return (
    bytesParams: number,
    precisionParam: number,
    toKibi: boolean,
    fromUnit: string,
    toRawBytes: boolean,
  ) => {
    let bytes = bytesParams;
    let precision = precisionParam;
    if (fromUnit) {
      const fromKibiUnitIndex = kibiUnits.indexOf(fromUnit, 0);
      const fromUnitIndex = units.indexOf(fromUnit, 0);
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

    return `${value} ${toKibi ? tKibiUnits[number] : tUnits[number]}`;
  };
};
