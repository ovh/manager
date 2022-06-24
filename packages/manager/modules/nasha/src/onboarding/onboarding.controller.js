import { GUIDES } from './constants';

export default class OnboardingNashaController {
  /* @ngInject */
  constructor($translate, coreConfig, coreURLBuilder) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.cta = coreURLBuilder.buildURL('dedicated', '#/nasha/new');
  }

  async $onInit() {
    const user = await this.coreConfig.getUser();
    this.ovhSubsidiary = user.ovhSubsidiary;
    this.guides = GUIDES.map((guide) => ({
      link: guide.links[this.ovhSubsidiary] || guide.links.DEFAULT,
      description: this.$translate.instant(guide.description),
      title: this.$translate.instant(guide.title),
    }));
  }
}
