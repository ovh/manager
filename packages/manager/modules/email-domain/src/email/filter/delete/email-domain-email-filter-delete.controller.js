import get from 'lodash/get';

export default class EmailsDeleteFilterCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.account = this.$scope.currentActionData.account || null;
    this.filter = this.$scope.currentActionData.filter || null;
    this.$scope.deleteFilter = () => this.deleteFilter();
  }

  deleteFilter() {
    let filterPromise;
    if (get(this.$scope.currentActionData, 'delegate', false)) {
      filterPromise = this.WucEmails.deleteDelegatedFilter(
        this.account.email,
        this.filter.name,
      );
    } else {
      filterPromise = this.WucEmails.deleteFilter(
        this.$stateParams.productId,
        this.account.accountName,
        this.filter.name,
      );
    }

    return filterPromise
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_delete_filter_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_delete_filter_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }
}
