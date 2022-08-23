import illustration from './assets/instance.png';
import {
  GUIDES,
  PREFIX_TRACKING_ONBOARDING,
  PREFIX_TRACKING_ONBOARDING_GUIDES,
} from './onboarding.constants';
import { NASHA_TITLE } from '../nasha.constants';

export default class NashaOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    const { ovhSubsidiary } = coreConfig.getUser();
    this.illustration = illustration;
    this.title = NASHA_TITLE;
    this.guides = GUIDES.map((guide) => ({
      ...guide,
      title: $translate.instant(`nasha_onboarding_${guide.id}_title`),
      description: $translate.instant(`nasha_onboarding_${guide.id}_content`),
      link: guide.link[ovhSubsidiary] || guide.link.WW,
    }));
    this.PREFIX_TRACKING_ONBOARDING_GUIDES = PREFIX_TRACKING_ONBOARDING_GUIDES;
  }

  onOrderClick() {
    this.trackClick(PREFIX_TRACKING_ONBOARDING, 'add');
    return this.goToOrder();
  }
}
