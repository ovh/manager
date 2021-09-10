import get from 'lodash/get';

export default class EmailsDeleteResponderCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.responder = this.$scope.currentActionData.responder;
    this.$scope.deleteResponder = () => this.deleteResponder();
  }

  deleteResponder() {
    let promise;
    if (get(this.$scope.currentActionData, 'delegate', false)) {
      promise = this.WucEmails.deleteDelegatedResponder(
        `${this.responder.account}@${this.$stateParams.productId}`,
        this.responder.account,
      );
    } else {
      promise = this.WucEmails.deleteResponder(
        this.$stateParams.productId,
        this.responder.account,
      );
    }
    return promise
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_delete_responder_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_delete_responder_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }
}
