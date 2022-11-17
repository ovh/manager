import illustration from './assets/ip.png';
import { ADDITIONAL_IP_URL, GUIDES } from './onboarding.constants';

export default class IpOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    const { ovhSubsidiary } = coreConfig.getUser();
    this.additionalIpUrl =
      ADDITIONAL_IP_URL[ovhSubsidiary] || ADDITIONAL_IP_URL.WW;
    this.illustration = illustration;
    this.guides = GUIDES.map((guide) => ({
      ...guide,
      title: $translate.instant(`ip_onboarding_${guide.id}_title`),
      description: $translate.instant(`ip_onboarding_${guide.id}_content`),
      link: guide.link[ovhSubsidiary] || guide.link.WW,
    }));
  }
}
