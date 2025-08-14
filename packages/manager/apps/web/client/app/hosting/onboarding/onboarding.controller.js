import { GUIDES, CTAS } from './constants';

export default class HostingsOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  async $onInit() {
    const user = await this.coreConfig.getUser();
    const region = await this.coreConfig.getRegion();
    this.ovhSubsidiary = user.ovhSubsidiary;
    this.guides = GUIDES.filter((guide) => {
      return guide.region ? guide.region.includes(region) : true;
    }).map((guide) => ({
      link: guide.links[this.ovhSubsidiary] || guide.links.DEFAULT,
      title: this.$translate.instant(guide.title, { value: '100M' }),
      description: this.$translate.instant(guide.description, {
        value: '100M',
      }),
    }));
    this.cta = CTAS[this.ovhSubsidiary] || CTAS.DEFAULT;
  }
}
