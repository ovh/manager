import find from 'lodash/find';

import { UNITS } from './constants';

export default class ovhManagerBmServerComponentsOsInstallFormatSizeUtils {
  static toMb(diskSize, diskUnit) {
    const unitModel = find(UNITS.model, (unit) => unit.label === diskUnit);
    if (unitModel) {
      return diskSize * unitModel.value;
    }
    return diskSize;
  }
}
