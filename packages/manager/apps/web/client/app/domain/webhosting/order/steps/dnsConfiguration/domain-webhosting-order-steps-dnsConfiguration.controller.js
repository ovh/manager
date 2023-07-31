import { DOMAIN_TRACKING } from '../../../../../hosting/hosting.constants';

export default class {
  /* @ngInject */
  constructor(atInternet, ovhFeatureFlipping) {
    this.atInternet = atInternet;
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

  trackClick(hit) {
    return this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
  }

  onDnsConfigClick() {
    this.trackClick(DOMAIN_TRACKING.STEP_3.ACTIVATE_DNS);
  }

  onEmailConfigClick() {
    this.trackClick(DOMAIN_TRACKING.STEP_3.ACTIVATE_EMAIL);
  }

  onGoToNextStepClick() {
    this.trackClick(DOMAIN_TRACKING.STEP_3.GO_TO_NEXT_STEP);

    this.updateDnsConfiguration();
  }
}
