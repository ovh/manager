import angular from 'angular';
import { unitsValues } from './constants';

export default class OvhManagerServerBandwidthService {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  getValueAndUnitForToUnit(bytes, precision, toUnit) {
    let i;
    let ii;
    let value = bytes; // Bytes by default
    const unit = this.$translate.instant('bandwidth_unit_size_bps'); // Bytes by default

    if (toUnit !== this.$translate.instant('bandwidth_unit_size_bps')) {
      for (i = 0, ii = unitsValues.length; i < ii; i += 1) {
        if (
          toUnit ===
          this.$translate.instant(`bandwidth_unit_size_${unitsValues[i].unit}`)
        ) {
          value = (bytes / unitsValues[i].value).toFixed(precision);
          break;
        }
      }
    }

    return { value, unit };
  }

  getValueAndUnit(bytes, precision) {
    let i;
    let ii;
    let value = bytes; // Bytes by default
    let unit = this.$translate.instant('bandwidth_unit_size_bps'); // Bytes by default
    const absBytes = Math.abs(bytes);

    for (i = 0, ii = unitsValues.length; i < ii; i += 1) {
      if (
        absBytes >= unitsValues[i].value &&
        (angular.isDefined(unitsValues[i + 1])
          ? absBytes < unitsValues[i + 1].value
          : true)
      ) {
        value = (bytes / unitsValues[i].value).toFixed(precision);
        unit = this.$translate.instant(
          `bandwidth_unit_size_${unitsValues[i].unit}`,
        );
        break;
      }
    }

    return { value, unit };
  }

  static convertFrom(bandwidth) {
    let i;
    let ii;
    for (i = 0, ii = unitsValues.length; i < ii; i += 1) {
      if (unitsValues[i].unit === bandwidth.unit) {
        return bandwidth.value * unitsValues[i].value;
      }
    }
    return bandwidth.value;
  }

  static compareBandwidths(bandwidthA, bandwidthB) {
    const bandwidthAValue = OvhManagerServerBandwidthService.convertFrom(
      bandwidthA,
    );
    const bandwidthBValue = OvhManagerServerBandwidthService.convertFrom(
      bandwidthB,
    );

    return bandwidthAValue < bandwidthBValue ? bandwidthA : bandwidthB;
  }
}
