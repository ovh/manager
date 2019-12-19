import isFinite from 'lodash/isFinite';
import isNaN from 'lodash/isNaN';
import isUndefined from 'lodash/isUndefined';

export default /* @ngInject */ ($translate) => function unitHumanizeFilter(bytes, type, precision) {
  let precisionVal = precision;
  if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
    return '-';
  }
  if (isUndefined(precision)) {
    precisionVal = 1;
  }
  const units = {
    bit: [
      'unit_bits_per_sec',
      'unit_kilo_bits_per_sec',
      'unit_mega_bits_per_sec',
      'unit_giga_bits_per_sec',
      'unit_tera_bits_per_sec',
      'unit_peta_bits_per_sec',
    ],
    generic: [
      'unit_generic_per_sec',
      'unit_kilo_generic_per_sec',
      'unit_mega_generic_per_sec',
      'unit_giga_generic_per_sec',
      'unit_tera_generic_per_sec',
      'unit_peta_generic_per_sec',
    ],
  };
  const number = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precisionVal); // eslint-disable-line
  return $translate.instant(units[type || 'generic'][number], { val: value });
};
