export default class {
  /* @ngInject */
  constructor($scope, $translate, DedicatedCloud) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.selectedLogoutPolicy = {
      value: null,
    };
  }

  modifyPolicyLogout() {
    this.loading = true;
    return this.DedicatedCloud.modifyPolicyLogout(
      this.productId,
      this.selectedLogoutPolicy.value,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_configuration_SECURITY_policy_logout_success',
          ),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_SECURITY_policy_logout_fail',
          )} ${err.message || err}`,
          'danger',
        );
      });
  }
}
