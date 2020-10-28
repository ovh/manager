export default class LogsAccountSetupCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    CucControllerHelper,
    CucCloudMessage,
    LogsAccountService,
    LogsHomeService,
    LogsDetailService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsAccountService = LogsAccountService;
    this.LogsHomeService = LogsHomeService;
    this.LogsDetailService = LogsDetailService;
    this.passwordRules = this.LogsAccountService.getPasswordRules(false);

    this.initLoaders();
  }

  initLoaders() {
    this.service = this.CucControllerHelper.request
      .getHashLoader({
        loaderFunction: () =>
          this.LogsDetailService.getServiceDetails(this.serviceName).then(
            (service) => {
              this.userName = service.username;
              return service;
            },
          ),
      })
      .load();
    this.accountDetails = this.CucControllerHelper.request
      .getHashLoader({
        loaderFunction: () =>
          this.LogsHomeService.getAccountDetails(this.serviceName).then(
            (account) => {
              this.fullName = `${account.me.firstname} ${account.me.name}`;
              return account;
            },
          ),
      })
      .load();
  }

  resetPasswordRules() {
    this.passwordRules = this.LogsAccountService.getPasswordRules(true);
  }

  changePassword() {
    if (this.form.$invalid) {
      return this.$q.when();
    }
    this.CucCloudMessage.flushChildMessage();
    return this.LogsAccountService.changePassword(
      this.serviceName,
      this.newPassword,
      true,
    ).then(() => {
      this.$state.go(
        'dbaas-logs.detail.home',
        { serviceName: this.serviceName },
        { reload: true },
      );
    });
  }
}
