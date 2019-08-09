import {
  ACTIVATION_STATUS,
} from './activationStatus.constants';

export default class {
  $onInit() {
    this.onStatusChange();
  }

  $onChange() {
    this.onStatusChange();
  }

  onStatusChange() {
    this.status = ACTIVATION_STATUS[this.statusName];

    if (this.status == null) {
      throw new RangeError(`ovhManagerComponentActivationStatus: ${this.statusName} is not a valid activation status`);
    }
  }
}
