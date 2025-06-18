import { OLA_MODES } from '../ola/ola.constants';
import { LABELS } from './interfaces.constants';

export default class BMNetworkInterfaceController {
  /* @ngInject */
  constructor() {
    this.LABELS = LABELS;
  }

  $onInit() {
    this.isFullyAggregated = this.ola.getCurrentMode() === OLA_MODES.FULL_LAG;
  }
}
