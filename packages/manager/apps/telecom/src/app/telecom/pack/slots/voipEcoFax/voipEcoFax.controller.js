import head from 'lodash/head';

export default class PackVoipEcoFaxCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $translate,
    OvhApiPackXdslVoipBillingAccount,
    OvhApiPackXdslVoipEcofax,
    TucToast,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiPackXdslVoipBillingAccount = OvhApiPackXdslVoipBillingAccount;
    this.OvhApiPackXdslVoipEcofax = OvhApiPackXdslVoipEcofax;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.details = this.$scope.service;
    this.packName = this.$stateParams.packName;
    this.services = [];

    this.loaders = {
      services: true,
    };

    // Get service link to this access from current Pack Xdsl
    return this.$q
      .all({
        ecofaxes: this.OvhApiPackXdslVoipEcofax.v6().query({
          packId: this.packName,
        }).$promise,
        billingAccount: this.OvhApiPackXdslVoipBillingAccount.v6().query({
          packId: this.packName,
        }).$promise,
      })
      .then(({ ecofaxes, billingAccount }) => {
        this.services = ecofaxes;
        this.billingAccount = head(billingAccount);
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('ecofax_pro_loading_error'),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loaders.services = false;
      });
  }
}
