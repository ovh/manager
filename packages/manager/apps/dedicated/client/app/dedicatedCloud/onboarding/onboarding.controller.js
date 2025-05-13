import { GUIDES, CTAS, US_GUIDES, US_CTA } from './constants';
import illustration from './assets/vmware.svg';

export default class DedicatedCloudsOnboardingController {
  /* @ngInject */
  constructor($translate, atInternet, coreConfig) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.illustration = illustration;
  }

  async $onInit() {
    const user = await this.coreConfig.getUser();
    this.ovhSubsidiary = user.ovhSubsidiary;

    let guides = GUIDES;
    let cta = CTAS[this.ovhSubsidiary] || CTAS.DEFAULT;
    if (this.ovhSubsidiary === 'US') {
      guides = US_GUIDES;
      cta = US_CTA;
    }

    this.guides = guides.map((guide) => ({
      id: guide.id,
      link: guide.links
        ? guide.links[this.ovhSubsidiary] || guide.links.DEFAULT
        : guide.link,
      description: this.$translate.instant(guide.description),
      title: this.$translate.instant(guide.title),
    }));
    this.cta = cta;
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `dedicated::dedicatedCloud::onboarding::${hit}`,
      type: 'action',
    });
  }
}
