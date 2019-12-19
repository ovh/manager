export default class SharepointDeleteDomainController {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, MicrosoftSharepointLicenseService) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.sharepointService = MicrosoftSharepointLicenseService;
  }

  $onInit() {
    this.domain = this.$scope.currentActionData;
    this.$scope.deleteDomain = () => this.deleteDomain();
  }

  deleteDomain() {
    return this.sharepointService
      .deleteSharepointUpnSuffix(this.$stateParams.exchangeId, this.domain.suffix)
      .then(() => {
        this.alerter.success(this.$translate.instant('sharepoint_delete_domain_confirm_message_text', { t0: this.domain.suffix }), this.$scope.alerts.main);

        // TODO refresh domain's table
      })
      .catch((err) => this.alerter.alertFromSWS(this.$translate.instant('sharepoint_delete_domain_error_message_text'), err, this.$scope.alerts.main))
      .finally(() => {
        this.$scope.resetAction();
      });
  }
}
