import {
  PREFIX_TRACKING_NUTANIX,
  PREFIX_TRACKING_ONBOARDING,
  PREFIX_TRACKING_ONBOARDING_GUIDES,
  GUIDES,
  CTAS,
} from './constants';
import illustration from './assets/Nutanix.png';

export default class NutanixOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig, atInternet) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.atInternet = atInternet;
    this.illustration = illustration;
  }

  async $onInit() {
    const user = await this.coreConfig.getUser();
    this.ovhSubsidiary = user.ovhSubsidiary;
    this.guides = GUIDES.map((guide) => ({
      ...guide,
      link: guide.links[this.ovhSubsidiary] || guide.links.DEFAULT,
      description: this.$translate.instant(guide.description),
      title: this.$translate.instant(guide.title),
    }));
    this.cta = CTAS[this.ovhSubsidiary] || CTAS.DEFAULT;
    this.PREFIX_TRACKING_ONBOARDING = PREFIX_TRACKING_ONBOARDING;
    this.PREFIX_TRACKING_ONBOARDING_GUIDES = PREFIX_TRACKING_ONBOARDING_GUIDES;
  }

  trackClick(subPrefixTracking, hit) {
    this.atInternet.trackClick({
      name: `${PREFIX_TRACKING_NUTANIX}::${subPrefixTracking}::${hit}`,
      type: 'action',
    });
  }
}
