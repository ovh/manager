import { TERMINATE_VALUE } from './vrack-terminate-modal.constants';

export default class VrackTerminateModalCtrl {
  $onInit() {
    this.terminateField = null;
    this.terminateValue = TERMINATE_VALUE;
    this.isTerminateFieldValid = false;
  }

  validateField() {
    this.isTerminateFieldValid = this.terminateField === TERMINATE_VALUE;
  }
}
