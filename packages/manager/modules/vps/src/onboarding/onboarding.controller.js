import { GUIDES, CTAS, US_GUIDES, US_CTA } from './constants';

export default class VPSOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  async $onInit() {
    const user = await this.coreConfig.getUser();
    this.ovhSubsidiary = user.ovhSubsidiary;
    this.isUS = this.coreConfig.isRegion('US');

    let guides = GUIDES;
    let cta = CTAS[this.ovhSubsidiary] || CTAS.DEFAULT;
    if (this.ovhSubsidiary === 'US') {
      guides = US_GUIDES;
      cta = US_CTA;
    }
    this.guides = guides.map((guide) => ({
      link: guide.links
        ? guide.links[this.ovhSubsidiary] || guide.links.DEFAULT
        : guide.link,
      description: this.$translate.instant(guide.description),
      title: this.$translate.instant(guide.title),
    }));
    this.cta = cta;
  }
}
