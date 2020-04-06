import { convertUnit, getValueFromUnit } from '../helpers/helpers';

export default /* @ngInject */ function($translate) {
  const UNITS = {
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

  return function bandwidthFilter(
    value,
    fromUnit,
    type = 'generic',
    toBinary = false,
    precision = 0,
  ) {
    const valueFromUnit = getValueFromUnit(fromUnit, value, toBinary);

    const { multiple, value: convertedValue } = convertUnit(
      valueFromUnit,
      toBinary,
      precision,
    );
    return $translate.instant(UNITS[type][multiple], {
      val: convertedValue,
    });
  };
}
