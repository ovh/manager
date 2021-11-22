import get from 'lodash/get';

export default class EmailsUpdateUsageAccountCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.isDelegate = get(this.$scope.currentActionData, 'delegate', false);
    this.account = this.isDelegate
      ? this.$scope.currentActionData.account
      : this.$scope.currentActionData;
    this.lastUpdated = {
      diff: null,
      value: null,
    };
    this.loading = false;

    this.$scope.updateUsageAccount = () => this.updateUsageAccount();

    this.getUsageAccount();
  }

  getUsageAccount() {
    this.loading = true;

    let getUsagePromise;
    if (this.isDelegate) {
      getUsagePromise = this.WucEmails.getEmailDelegatedUsage(
        this.account.email,
      );
    } else {
      getUsagePromise = this.WucEmails.getEmailUsage(
        this.$stateParams.productId,
        this.account.accountName,
      );
    }

    return getUsagePromise
      .then((quota) => {
        this.lastUpdated.value = quota.date;
        this.lastUpdated.diff = parseInt(
          moment().diff(this.lastUpdated.value, 'minutes'),
          10,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  isCheckAuthorized() {
    return !this.lastUpdated.diff || this.lastUpdated.diff > 5;
  }

  isUsageRequestValid() {
    return !this.loading && !this.account.isBlocked && this.isCheckAuthorized();
  }

  updateUsageAccount() {
    this.loading = true;

    let updateUsagePromise;
    if (this.isDelegate) {
      updateUsagePromise = this.WucEmails.updateDelegatedUsage(
        this.account.email,
      );
    } else {
      updateUsagePromise = this.WucEmails.updateUsage(
        this.$stateParams.productId,
        this.account.accountName,
      );
    }

    return updateUsagePromise
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_update_usage_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_update_usage_error'),
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
