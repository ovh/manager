import {
  GUIDES,
  CTA,
  TRACKING_NAME,
  TRACKING_CHAPTER_1,
  PRIVATE_NETWORK_HELP,
} from './constants';
import illustration from './assets/public-cloud-network_load-balancer-v2.png';

export default class OctaviaLoadBalancerOnboardingCtrl {
  /* @ngInject */
  constructor($translate, coreConfig, atInternet) {
    const { ovhSubsidiary } = coreConfig.getUser();
    this.GUIDES = GUIDES.map((guide) => ({
      ...guide,
      title: $translate.instant(guide.title),
      description: $translate.instant(guide.description),
      link: guide.links[ovhSubsidiary] || guide.links.DEFAULT,
    }));
    this.illustration = illustration;
    this.cta = CTA[ovhSubsidiary] || CTA.DEFAULT;
    this.privateNetworkHelpUrl =
      PRIVATE_NETWORK_HELP[ovhSubsidiary] || PRIVATE_NETWORK_HELP.DEFAULT;
    this.atInternet = atInternet;
    this.ctaTrackName = `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::add`;
  }

  onGuideClick(guide) {
    this.atInternet.trackClick({
      name: `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::documentation::${guide.title
        .toLowerCase()
        .replace(/[\s']/g, '_')}`,
      type: 'navigation',
    });
  }

  createLoadBalancer() {
    if (this.hasPrivateNetwork) {
      this.goToLoadBalancerCreation();
    } else {
      this.goToNoPrivateNetwork();
    }
  }
}
