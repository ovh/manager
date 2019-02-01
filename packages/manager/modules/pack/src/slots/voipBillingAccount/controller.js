export default class {
  /* @ngInject */
  constructor(
    OvhApiPackXdslVoipBillingAccount,
  ) {
    this.OvhApiPackXdslVoipBillingAccount = OvhApiPackXdslVoipBillingAccount;
  }

  $onInit() {
    this.details = this.service;
    this.services = [];

    this.loading = true;

    // Get service link to this access from current Pack Xdsl
    return this.OvhApiPackXdslVoipBillingAccount
      .v6()
      .query({
        packId: this.pack.packName,
      })
      .$promise
      .then((services) => {
        this.services = [...services];
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
