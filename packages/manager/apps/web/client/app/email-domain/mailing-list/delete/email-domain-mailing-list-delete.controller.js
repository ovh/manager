export default class MailingListsDeleteCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, MailingLists) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.MailingLists = MailingLists;
  }

  $onInit() {
    this.mailingList = this.$scope.currentActionData;
    this.loading = false;
    this.$scope.deleteMailingList = () => this.deleteMailingList();
  }

  deleteMailingList() {
    this.loading = true;
    return this.MailingLists.deleteMailingList(
      this.$stateParams.productId,
      this.mailingList.name,
    )
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('mailing_list_tab_modal_list_delete_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_list_delete_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading = false;
        this.$scope.resetAction();
      });
  }
}
