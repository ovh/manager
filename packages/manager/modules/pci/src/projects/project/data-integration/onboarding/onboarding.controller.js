import { DATA_INTEGRATION_TRACKING_PREFIX_FULL } from '../data-integration.constants';
import desktopLogo from './assets/data-integration.png';
import mobileLogo from './assets/data-integration-mobile.png';

export default class DataIntegrationOnboardingCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.logo = {
      desktop: desktopLogo,
      mobile: mobileLogo,
    };
  }

  trackAndGoToCli() {
    this.atInternet.trackClick({
      name: `${DATA_INTEGRATION_TRACKING_PREFIX_FULL}::onboarding::explore-cli`,
      type: 'action',
    });
    return this.goToCli();
  }
}
