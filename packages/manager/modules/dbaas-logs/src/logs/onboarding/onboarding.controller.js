import { GUIDES, CTAS } from './constants';
import image from './assets/logs.png';

export default class DbaasLogsOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.image = image;
  }

  async $onInit() {
    const user = await this.coreConfig.getUser();
    this.ovhSubsidiary = user.ovhSubsidiary;
    this.guides = GUIDES.map((guide) => ({
      link: guide.links[this.ovhSubsidiary] || guide.links.DEFAULT,
      description: this.$translate.instant(guide.description),
      title: this.$translate.instant(guide.title),
    }));
    this.cta = CTAS[this.ovhSubsidiary] || CTAS.DEFAULT;
  }
}
