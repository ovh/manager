export default class LogsAccountSetupCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    coreURLBuilder,
    CucControllerHelper,
    CucCloudMessage,
    LogsAccountService,
    LogsHomeService,
    LogsDetailService,
    LogsConstants,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.coreURLBuilder = coreURLBuilder;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsAccountService = LogsAccountService;
    this.LogsHomeService = LogsHomeService;
    this.LogsDetailService = LogsDetailService;
    this.LogsConstants = LogsConstants;
    this.passwordRules = this.LogsAccountService.getPasswordRules(false);

    this.initLoaders();
  }

  initLoaders() {
    this.iamUrl = this.coreURLBuilder.buildURL('iam', '/#');
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

  enableIam() {
    this.CucCloudMessage.flushChildMessage();
    this.enableIam = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsHomeService.enableIam(this.serviceName, this.service),
      successHandler: () =>
        this.$state.go(
          'dbaas-logs.detail.home',
          { serviceName: this.serviceName },
          { reload: true },
        ),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.enableIam.load();
  }
}
