import { DATA_INTEGRATION_TRACKING_PREFIX_FULL } from '../data-integration.constants';
import desktopLogo from './assets/data-integration.png';
import mobileLogo from './assets/data-integration-mobile.png';
import { GUIDES } from './onboarding.constants';

export default class DataIntegrationOnboardingCtrl {
  /* @ngInject */
  constructor($translate, atInternet, coreConfig) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.logo = {
      desktop: desktopLogo,
      mobile: mobileLogo,
    };
    this.guides = GUIDES.map((guide) => ({
      link: guide.links[this.user.ovhSubsidiary] || guide.links.DEFAULT,
      title: this.$translate.instant(
        `pci_data_integration_onboarding_guides_${guide.id}_title`,
      ),
      description: this.$translate.instant(
        `pci_data_integration_onboarding_guides_${guide.id}_description`,
      ),
    }));
  }

  onDocumentationClick(guide) {
    this.atInternet.trackClick({
      name: `${DATA_INTEGRATION_TRACKING_PREFIX_FULL}::onboarding::docs::${guide.id}`,
      type: 'action',
    });
  }

  trackAndGoToCli() {
    this.atInternet.trackClick({
      name: `${DATA_INTEGRATION_TRACKING_PREFIX_FULL}::onboarding::explore-cli`,
      type: 'action',
    });
    return this.goToCli();
  }
}
