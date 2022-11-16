export default class {
  /* @ngInject */
  constructor(ovhFeatureFlipping) {
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    const emailDnsConfigurationFeature = 'hosting:email-dns-configuration';

    this.ovhFeatureFlipping
      .checkFeatureAvailability(emailDnsConfigurationFeature)
      .then((featureAvailability) => {
        this.emailDnsConfigurationAvailable = featureAvailability.isFeatureAvailable(
          emailDnsConfigurationFeature,
        );
      });
  }

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
