export default class EmailsDeleteRedirectionCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.redirection = this.$scope.currentActionData.redirection;
    this.$scope.deleteRedirection = () => this.deleteRedirection();
  }

  deleteRedirection() {
    return this.WucEmails.deleteRedirection(
      this.$stateParams.productId,
      this.redirection.id,
    )
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_delete_redirection_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_delete_redirection_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }
}
