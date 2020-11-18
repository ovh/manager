import angular from 'angular';

export default /* @ngInject */ ($translate) => {
  /* eslint-disable no-restricted-properties */
  const unitsValues = [
    {
      unit: 'bps',
      value: 1000,
    },
    {
      unit: 'Mbps',
      value: Math.pow(1000, 2),
    },
    {
      unit: 'Gbps',
      value: Math.pow(1000, 3),
    },
    {
      unit: 'Tbps',
      value: Math.pow(1000, 4),
    },
    {
      unit: 'Pbps',
      value: Math.pow(1000, 5),
    },
    {
      unit: 'Ebps',
      value: Math.pow(1000, 6),
    },
    {
      unit: 'Zbps',
      value: Math.pow(1000, 7),
    },
    {
      unit: 'Ybps',
      value: Math.pow(1000, 8),
    },
  ];
  /* eslint-enable no-restricted-properties */

  function getValueAndUnitForToUnit(bytes, precision, toUnit) {
    let i;
    let ii;
    let value = bytes; // Bytes by default
    const unit = $translate.instant('bandwidth_unit_size_bps'); // Bytes by default

    if (toUnit !== $translate.instant('bandwidth_unit_size_bps')) {
      for (i = 0, ii = unitsValues.length; i < ii; i += 1) {
        if (
          toUnit ===
          $translate.instant(`bandwidth_unit_size_${unitsValues[i].unit}`)
        ) {
          value = (bytes / unitsValues[i].value).toFixed(precision);
          break;
        }
      }
    }

    return { value, unit };
  }

  function getValueAndUnit(bytes, precision) {
    let i;
    let ii;
    let value = bytes; // Bytes by default
    let unit = $translate.instant('bandwidth_unit_size_bps'); // Bytes by default
    const absBytes = Math.abs(bytes);

    for (i = 0, ii = unitsValues.length; i < ii; i += 1) {
      if (
        absBytes >= unitsValues[i].value &&
        (angular.isDefined(unitsValues[i + 1])
          ? absBytes < unitsValues[i + 1].value
          : true)
      ) {
        value = (bytes / unitsValues[i].value).toFixed(precision);
        unit = $translate.instant(`bandwidth_unit_size_${unitsValues[i].unit}`);
        break;
      }
    }

    return { value, unit };
  }

  function convertFrom(bandwidth) {
    let i;
    let ii;
    for (i = 0, ii = unitsValues.length; i < ii; i += 1) {
      if (unitsValues[i].unit === bandwidth.unit) {
        return bandwidth.value * unitsValues[i].value;
      }
    }
    return bandwidth.value;
  }

  return function bandwidthFilter(bandwidth, _mode, _precision, toUnit) {
    let mode = _mode;
    let precision = _precision;
    if (!bandwidth) {
      return null;
    }
    const bytes = convertFrom(bandwidth);
    let valueAndUnit = {};

    if (!angular.isNumber(precision)) {
      precision = 0;
    }

    if ($.inArray(mode, ['value', 'unit']) === -1) {
      mode = null;
    }

    if (toUnit) {
      valueAndUnit = getValueAndUnitForToUnit(bytes, precision, toUnit);
    } else {
      valueAndUnit = getValueAndUnit(bytes, precision);
    }

    let result;
    if (mode === 'value') {
      result = valueAndUnit.value;
    } else if (mode === 'unit') {
      result = valueAndUnit.unit;
    } else {
      result = `${valueAndUnit.value} ${valueAndUnit.unit}`;
    }
    return result;
  };
};
