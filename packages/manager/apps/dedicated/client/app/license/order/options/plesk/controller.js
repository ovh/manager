export default class PleskLicenseAdditionalOptionsController {
  $onInit() {
    this.powerpack = false;
  }

  onPowerpackOptionChange(value) {
    this.options.PLESK.powerpack = value
      ? { value: this.version.more.powerPackPlanCode }
      : null;
    this.onOptionsChange();
  }
}
