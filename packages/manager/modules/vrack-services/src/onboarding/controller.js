import { GUIDES, DISCOVER_CTA, TRACKING_NAME } from './constants';

export default class VrackServicesOnboardingCtrl {
  /* @ngInject */
  constructor($translate, coreConfig, atInternet, $window) {
    this.user = coreConfig.getUser();
    this.atInternet = atInternet;
    this.$window = $window;
    this.$translate = $translate;
  }

  $onInit() {
    const { ovhSubsidiary } = this.user;
    this.GUIDES = GUIDES.map((guide) => ({
      ...guide,
      title: this.$translate.instant(guide.title),
      description: this.$translate.instant(guide.description),
      link: guide.links[ovhSubsidiary] || guide.links.DEFAULT,
    }));
    this.discoverCta = DISCOVER_CTA[ovhSubsidiary] || DISCOVER_CTA.DEFAULT;
  }

  onGuideClick(guide) {
    this.atInternet.trackClick({
      name: `${TRACKING_NAME}::documentation::${guide.title
        .toLowerCase()
        .replace(/[\s']/g, '_')}`,
      type: 'navigation',
    });
  }

  // TODO: REDIRECT TO CREATION STATE
  // createVrack() {
  // }
}
