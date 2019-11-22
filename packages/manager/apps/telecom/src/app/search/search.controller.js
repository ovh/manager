import isEmpty from 'lodash/isEmpty';

export default class TelecomSearchController {
  /* @ngInject */
  constructor(
    query,
    $state,
    billingAccount,
    packs,
    services,
    sms,
    freefax,
    overTheBox,
    telecomBillingAccount,
  ) {
    this.$state = $state;
    this.telecomBillingAccount = telecomBillingAccount;

    this.rawQuery = query;
    this.query = query;
    this.results = {
      billingAccount,
      services,
      packs,
      sms,
      freefax,
      overTheBox,
    };
  }

  $onInit() {
    if (this.query) {
      this.search();
    }
  }

  search() {
    this.$state.go(this.$state.$current.name, {
      q: this.query,
    });
  }

  hasResults() {
    return !isEmpty(this.results.services)
      || !isEmpty(this.results.billingAccount)
      || !isEmpty(this.results.packs)
      || !isEmpty(this.results.sms)
      || !isEmpty(this.results.freefax)
      || !isEmpty(this.results.overTheBox);
  }

  getServiceLink(billingAccount, service) {
    return this.telecomBillingAccount.getServiceLink(billingAccount, service);
  }
}
