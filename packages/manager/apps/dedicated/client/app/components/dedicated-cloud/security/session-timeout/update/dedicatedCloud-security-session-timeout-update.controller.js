export default class {
  /* @ngInject */
  constructor($scope, $translate, DedicatedCloud) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.sessionTimeout = {
      value: null,
      current: this.userSessionTimeout,
      never: false,
    };
  }

  updateSessionTimeout() {
    this.loading = true;
    return this.DedicatedCloud.updateSessionExpiration(
      this.productId,
      (this.sessionTimeout.never && '0') || this.sessionTimeout.value,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_configuration_SECURITY_update_session_timeout_success',
          ),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_SECURITY_update_session_timeout_fail',
          )} ${err.message || err}`,
        );
      });
  }
}
