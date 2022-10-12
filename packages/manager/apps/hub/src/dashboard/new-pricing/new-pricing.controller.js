import { FAQ_NEW_PRICING } from './new-pricing.constants';

export default class NewPricingController {
  /* @ngInject */
  constructor(atInternet, coreConfig) {
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.faqUrl =
      FAQ_NEW_PRICING[this.ovhSubsidiary] || FAQ_NEW_PRICING.DEFAULT;
  }

  trackFaqClick() {
    this.atInternet.trackClick({
      name: 'hub::app::dashboard::newPricing::goto-price-adjustments-faq',
      type: 'action',
    });
  }
}
