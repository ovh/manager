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

    if (this.ovhSubsidiary === 'FR') {
      this.description = this.$translate.instant(
        'exchange_onboarding_description_fr',
      );
    } else if (['ASIA', 'CA', 'WE', 'WS', 'QC'].includes(this.ovhSubsidiary)) {
      this.description = this.$translate.instant(
        'exchange_onboarding_description_ca',
      );
    } else {
      this.description = this.$translate.instant(
        'exchange_onboarding_description_eu',
      );
    }
  }
}
