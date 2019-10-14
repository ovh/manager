import {
  ASIATOUCH, GERMANTOUCH, FRENCHTOUCH, USTOUCH,
} from './price.constants';

export default class EnterpriseCloudDatabasePriceCtrl {
  /* @ngInject */
  constructor() {
    this.ASIATOUCH = ASIATOUCH;
    this.GERMANTOUCH = GERMANTOUCH;
    this.FRENCHTOUCH = FRENCHTOUCH;
    this.USTOUCH = USTOUCH;
  }

  $onInit() {
    this.ovhSubsidiary = this.user.ovhSubsidiary;
  }

  getPriceText(priceInCents) {
    if (this.FRENCHTOUCH.includes(this.ovhSubsidiary)
      || this.GERMANTOUCH.includes(this.ovhSubsidiary)) {
      return `${priceInCents / 100000000}${this.user.currency.symbol}`;
    }
    return `${this.user.currency.symbol}${priceInCents / 100000000}`;
  }
}
