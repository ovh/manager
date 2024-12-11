import { CTAS, GUIDES, US_CTA, US_GUIDES } from './constants';

export default class VrackOnboardingCtrl {
  /* @ngInject */
  constructor($state, $translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.$state = $state;
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
      link: guide.links
        ? guide.links[this.ovhSubsidiary] || guide.links.DEFAULT
        : guide.link,
      description:
        guide.description && this.$translate.instant(guide.description),
      title: this.$translate.instant(guide.title),
    }));

    this.cta = cta;
  }

  goToOrder() {
    this.$state.go('vrack.order');
  }
}
