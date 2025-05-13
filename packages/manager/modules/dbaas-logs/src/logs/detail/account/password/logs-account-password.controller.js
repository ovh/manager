export default class LogsAccountPasswordCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $uibModalInstance,
    CucControllerHelper,
    CucCloudMessage,
    LogsAccountService,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.serviceName = this.$stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsAccountService = LogsAccountService;
    this.passwordRules = this.LogsAccountService.getPasswordRules(false);
  }

  resetPasswordRules() {
    this.passwordRules = this.LogsAccountService.getPasswordRules(true);
  }

  /**
   * change password
   *
   * @memberof LogsAccountPasswordCtrl
   */
  changePassword() {
    if (this.form.$invalid) {
      return this.$q.when();
    }
    this.CucCloudMessage.flushChildMessage();
    return this.LogsAccountService.changePassword(
      this.serviceName,
      this.newPassword,
      false,
    ).finally(() => {
      this.resetPasswordRules();
      this.$uibModalInstance.close();
    });
  }

  cancel() {
    this.resetPasswordRules();
    this.$uibModalInstance.dismiss();
  }
}
