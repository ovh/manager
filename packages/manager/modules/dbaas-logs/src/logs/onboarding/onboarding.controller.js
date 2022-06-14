import { GUIDES } from './constants';
import image from './assets/logs.png';

export default class DbaasLogsOnboardingController {
  /* @ngInject */
  constructor($state, $translate, coreConfig) {
    this.$state = $state;
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
    this.cta = this.$state.href('dbaas-logs.order');
  }
}
