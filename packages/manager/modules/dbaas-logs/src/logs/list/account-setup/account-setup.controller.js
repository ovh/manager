const ACCOUNT_MODES = {
  IAM: 'iam',
  PASSWORD: 'password',
};

export default class LogsAccountSetupCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucControllerHelper,
    CucCloudMessage,
    LogsAccountService,
    LogsHomeService,
    LogsDetailService,
    LogsConstants,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsAccountService = LogsAccountService;
    this.LogsHomeService = LogsHomeService;
    this.LogsDetailService = LogsDetailService;
    this.LogsConstants = LogsConstants;
    this.ACCOUNT_MODES = ACCOUNT_MODES;
  }

  $onInit() {
    this.initAccountModes();
    this.passwordRules = this.LogsAccountService.getPasswordRules(false);
  }

  initAccountModes() {
    this.accountModes = [
      {
        label: this.$translate.instant('dbaas_logs_account_setup_enable_iam'),
        value: ACCOUNT_MODES.IAM,
      },
      {
        label: this.$translate.instant(
          'dbaas_logs_account_setup_select_password',
        ),
        value: ACCOUNT_MODES.PASSWORD,
      },
    ];
    [this.accountMode] = this.accountModes;
  }

  resetPasswordRules() {
    this.passwordRules = this.LogsAccountService.getPasswordRules(true);
  }

  setupAccount() {
    this.loading = true;
    this.CucCloudMessage.flushChildMessage();
    const promise =
      this.accountMode.value === this.ACCOUNT_MODES.PASSWORD
        ? this.changePassword()
        : this.enableIam();
    return promise.finally(() => {
      this.loading = false;
    });
  }

  changePassword() {
    if (this.form.$invalid) {
      return this.$q.when();
    }
    return this.LogsAccountService.changePassword(
      this.serviceName,
      this.newPassword,
      true,
    )
      .then(this.goToDetail)
      .catch(this.CucControllerHelper.scrollPageToTop);
  }

  enableIam() {
    this.enableIam = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsHomeService.enableIam(this.service),
      successHandler: () => this.goToDetail(),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.enableIam.load();
  }
}
