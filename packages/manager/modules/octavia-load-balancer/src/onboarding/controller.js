import { GUIDES, CTA } from './constants';
import illustration from './assets/public-cloud-network_load-balancer-v2.png';

export default class OctaviaLoadBalancerOnboardingCtrl {
  /* @ngInject */
  constructor($translate, coreConfig) {
    const { ovhSubsidiary } = coreConfig.getUser();
    this.GUIDES = GUIDES.map((guide) => ({
      ...guide,
      title: $translate.instant(guide.title),
      description: $translate.instant(guide.description),
      link: guide.links[ovhSubsidiary] || guide.links.DEFAULT,
    }));
    this.illustration = illustration;
    this.cta = CTA[ovhSubsidiary] || CTA.DEFAULT;
  }
}
