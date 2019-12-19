export default class {
  enableHelpers() {
    this.isHostingHelpOpen = undefined;
    this.isEmailHelpOpen = undefined;
  }

  updateDnsConfiguration() {
    this.isHostingHelpOpen = false;
    this.isEmailHelpOpen = false;
    this.stepper.cartOption.dnsConfiguration = this.dnsConfiguration;
  }
}
