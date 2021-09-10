export default class EmailsDeleteAclCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.acl = this.$scope.currentActionData || null;
    this.$scope.deleteAcl = () => this.deleteAcl();
  }

  deleteAcl() {
    this.WucEmails.deleteAcl(this.$stateParams.productId, this.acl.accountId)
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_delete_acl_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_delete_acl_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }
}
