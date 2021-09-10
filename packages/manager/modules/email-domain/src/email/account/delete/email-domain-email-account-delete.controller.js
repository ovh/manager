export default class EmailsDeleteAccountCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.currentAccount = this.$scope.currentActionData || null;
    this.$scope.deleteAccount = () => this.deleteAccount();
  }

  deleteAccount() {
    this.WucEmails.deleteAccount(
      this.$stateParams.productId,
      this.currentAccount.accountName,
    )
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_delete_account_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_delete_account_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }
}
