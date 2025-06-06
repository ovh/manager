import { LABELS } from './interfaces.constants';

export default class BMNetworkInterfaceController {
  /* @ngInject */
  constructor() {
    this.LABELS = LABELS;
  }

  $onChanges({ interfaces }) {
    this.displayedInterfaces = interfaces.currentValue.map((nic) => ({
      ...nic,
      displayedMacAdresses: nic.mac ? nic.mac.split(', ') : [],
    }));
  }
}
