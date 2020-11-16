export default class {
  /* @ngInject */
  constructor(DedicatedCloud, $translate, REGEX) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.REGEX = REGEX;
  }

  $onInit() {
    this.entryToModify = angular.copy(this.policy);
    this.entryToModify.network = this.entryToModify.network.replace(
      /\/[0-9]+/,
      '',
    );
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
