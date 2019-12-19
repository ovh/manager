export default class SharepointDeleteAccountCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, MicrosoftSharepointLicenseService) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.sharepointService = MicrosoftSharepointLicenseService;
  }

  $onInit() {
    this.account = this.$scope.currentActionData;
    this.$scope.submit = () => this.submit();
  }

  submit() {
    this.$scope.resetAction();
    return this.sharepointService
      .deleteSharepointAccount(this.$stateParams.exchangeId, this.account.userPrincipalName)
      .then(() => this.alerter.success(this.$translate.instant('sharepoint_account_action_sharepoint_remove_success_message', { t0: this.account.userPrincipalName }), this.$scope.alerts.main))
      .catch((err) => this.alerter.alertFromSWS(this.$translate.instant('sharepoint_account_action_sharepoint_remove_error_message'), err, this.$scope.alerts.main))
      .finally(() => {
        this.$scope.resetAction();
      });
  }
}
