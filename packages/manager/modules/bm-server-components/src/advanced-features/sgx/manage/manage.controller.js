import { STATUS } from '../sgx.constants';

export default class {
  $onInit() {
    this.trackPage(`${this.sgxTrackingPrefix}::manage`);
    this.formIsValid = false;

    this.activationMode = this.initialActivationMode;
    this.prmrr = this.initialPrmrr;
  }

  onChange() {
    const selectedModeIsTheSameAsInitial =
      this.initialActivationMode === this.activationMode;

    if (selectedModeIsTheSameAsInitial) {
      this.formIsValid =
        this.activationMode !== STATUS.DISABLED &&
        this.initialPrmrr !== this.prmrr;
    } else {
      this.formIsValid = true;
    }
  }
}
