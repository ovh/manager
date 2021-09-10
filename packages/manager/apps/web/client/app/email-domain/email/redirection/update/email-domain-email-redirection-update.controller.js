export default class EmailsUpdateRedirectionCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.model = angular.copy(this.$scope.currentActionData.redirection);

    this.$scope.updateRedirection = () => this.updateRedirection();
  }

  static redirectionToCheck(input) {
    const value = input.$viewValue;
    input.$setValidity('redirectionTo', validator.isEmail(value));
  }

  updateRedirection() {
    return this.WucEmails.updateRedirection(this.$stateParams.productId, {
      id: this.model.id,
      data: {
        to: this.model.to,
      },
    })
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_update_redirection_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_update_redirection_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }
}
