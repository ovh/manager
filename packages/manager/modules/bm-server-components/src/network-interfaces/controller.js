import { OLA_MODES } from '../ola/ola.constants';
import { LABELS } from './interfaces.constants';

export default class BMNetworkInterfaceController {
  /* @ngInject */
  constructor() {
    this.LABELS = LABELS;
  }

  $onChanges({ interfaces, ola }) {
    this.displayedInterfaces = interfaces.currentValue.map((nic) => ({
      ...nic,
      displayedMacAdresses: nic.mac ? nic.mac.split(', ') : [],
    }));

    this.isFullyAggregated =
      ola.currentValue.getCurrentMode() === OLA_MODES.FULL_LAG;
  }
}
