export default class TelecomSearchController {
  /* @ngInject */
  constructor(query, $state, billingAccount, services, telecomBillingAccount) {
    this.$state = $state;
    this.telecomBillingAccount = telecomBillingAccount;

    this.rawQuery = query;
    this.query = query;
    this.results = {
      billingAccount,
      services,
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
    return this.results.services.length > 0 || this.results.billingAccount.length > 0;
  }

  getServiceLink(billingAccount, service) {
    return this.telecomBillingAccount.getServiceLink(billingAccount, service);
  }
}
