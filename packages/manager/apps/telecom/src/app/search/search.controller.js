export default class TelecomSearchController {
  constructor(apiv7, iceberg, $q, query, $state, billingAccount, services, telecomBillingAccount) {
    this.apiv7 = apiv7;
    this.iceberg = iceberg;
    this.$q = $q;
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
