import { CTA, GUIDES } from './constants';

export default class SmsOnboardingCtrl {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  async $onInit() {
    const user = await this.coreConfig.getUser();
    this.ovhSubsidiary = user.ovhSubsidiary;
    this.guides = GUIDES.map((guide) => ({
      link: guide.links[this.ovhSubsidiary] || guide.links.DEFAULT,
      description:
        guide.description && this.$translate.instant(guide.description),
      title: this.$translate.instant(guide.title),
    }));

    this.cta = CTA[this.ovhSubsidiary] || CTA.DEFAULT;
  }
}
