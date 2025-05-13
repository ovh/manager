export default class {
  /* @ngInject */
  constructor(DedicatedCloud, $translate) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.entryToModify = angular.copy(this.policy);
    this.loading = false;
  }

  modifyEntry() {
    this.loading = true;
    this.DedicatedCloud.modifySecurityPolicy(
      this.productId,
      this.entryToModify,
    ).then(
      () => {
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_configuration_SECURITY_policy_modify_success',
          ),
        );
      },
      (err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_SECURITY_policy_modify_fail',
            {
              t0: this.policy.network,
            },
          )} ${err.message || err}`,
          'danger',
        );
      },
    );
  }
}
