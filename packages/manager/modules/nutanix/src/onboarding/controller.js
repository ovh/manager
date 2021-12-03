import reduce from 'lodash/reduce';
import { GUIDES, CONTACT_US_PAGE_URL } from './constants';
import illustration from './assets/Nutanix.png';

export default class NutanixOnboardingCtrl {
  constructor($window, coreConfig) {
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.GUIDES = GUIDES;
  }

  $onInit() {
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
        },
      ],
      [],
    );
    this.illustration = illustration;
    this.user = this.coreConfig.getUser();
  }

  onContactUs() {
    this.$window.open(
      CONTACT_US_PAGE_URL[this.user.ovhSubsidiary] ||
        CONTACT_US_PAGE_URL.DEFAULT,
      '_blank',
      'noopener',
    );
  }
}
