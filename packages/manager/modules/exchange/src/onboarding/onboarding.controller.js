import { GUIDES } from './constants';

export default class ExchangeOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  async $onInit() {
    const user = await this.coreConfig.getUser();
    this.ovhSubsidiary = user.ovhSubsidiary;
    this.guides = GUIDES.filter((guide) => {
      if (guide.excludeRegion) {
        return ![]
          .concat(guide.excludeRegion)
          .includes(this.coreConfig.getRegion());
      }
      return true;
    }).map((guide) => ({
      link: guide.links[this.ovhSubsidiary] || guide.links.DEFAULT,
      description: this.$translate.instant(guide.description),
      title: this.$translate.instant(guide.title),
    }));
    this.cta = this.ctaURL;
  }
}
