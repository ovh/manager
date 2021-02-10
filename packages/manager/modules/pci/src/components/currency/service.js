import { CURRENCY_SUBSIDIARY, UCENTS_FACTOR } from './constants';

export default class CucCurrencyService {
  /* @ngInject */
  constructor(OvhApiMe, CucConfig) {
    this.OvhApiMe = OvhApiMe;
    this.CucConfig = CucConfig;
    this.currency = CURRENCY_SUBSIDIARY[this.CucConfig.getRegion()];
    this.ucentsFactor = UCENTS_FACTOR;
  }

  getSubsidiary() {
    return this.OvhApiMe.v6()
      .get()
      .$promise.then((user) => user.ovhSubsidiary);
  }

  loadCurrency() {
    return this.getSubsidiary().then((sub) => {
      const symbol = CURRENCY_SUBSIDIARY[sub];
      if (symbol) {
        this.currency = symbol;
      } else {
        this.currency = CURRENCY_SUBSIDIARY[this.CucConfig.getRegion()];
      }
    });
  }

  getCurrentCurrency() {
    return this.currency;
  }

  convertUcentsToCurrency(value, interval = 1) {
    return value / interval / this.ucentsFactor;
  }
}
