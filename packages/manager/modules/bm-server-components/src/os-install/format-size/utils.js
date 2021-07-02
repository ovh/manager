import forEach from 'lodash/forEach';

import {
  UNITS,
} from './constants';

export default class ovhManagerBmServerComponentsOsInstallFormatSizeUtils {
  static toMb(diskSize, diskUnit) {
    forEach(UNITS.model, (unit) => {
      if (unit.label === diskUnit) {
        return diskSize *= unit.value;
      }
    });
    return diskSize;
  }
}
