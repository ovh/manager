import { ORDER_WEBHOSTING_TRACKING } from '../../domain-webhosting-order.constants';

export default class {
  /* @ngInject */
  constructor(atInternet, ovhFeatureFlipping) {
    this.atInternet = atInternet;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.dnsConfiguration = {};
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
    if (this.stepper.cartOption.dnsConfiguration) {
      this.trackClick(ORDER_WEBHOSTING_TRACKING.DNS.EDIT);
    }
  }

  updateDnsConfiguration() {
    this.isHostingHelpOpen = false;
    this.isEmailHelpOpen = false;
    this.stepper.cartOption.dnsConfiguration = this.dnsConfiguration;
  }

  trackClick(hit) {
    return this.atInternet.trackClick({
      ...hit,
      type: 'action',
    });
  }

  onGoToNextStepClick() {
    const { enableHosting, enableEmails } = this.dnsConfiguration;
    const dnsConfig = [
      enableHosting && 'hosting-dns',
      enableEmails && 'email-dns',
    ]
      .filter(Boolean)
      .join('-');

    this.trackClick({
      ...ORDER_WEBHOSTING_TRACKING.DNS.NEXT,
      name: ORDER_WEBHOSTING_TRACKING.DNS.NEXT.name.replace(
        /{{dnsConfig}}/g,
        dnsConfig,
      ),
    });
    this.updateDnsConfiguration();
  }
}
