export default class SgxConfirmationController {
  $onInit() {
    this.trackPage(`${this.sgxTrackingPrefix}::manage::confirm`);
  }
}
