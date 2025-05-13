angular.module('App').controller(
  'HostingAutomatedEmailsRequestCtrl',
  class HostingAutomatedEmailsRequestCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $stateParams,
      $translate,
      HostingAutomatedEmails,
      Alerter,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.HostingAutomatedEmails = HostingAutomatedEmails;
      this.Alerter = Alerter;
    }

    $onInit() {
      this.automatedEmails = angular.copy(
        this.$scope.currentActionData.automatedEmails,
      );
      this.action = this.$scope.currentActionData.action;
      this.titles = {
        BLOCK: this.$translate.instant(
          'hosting_tab_AUTOMATED_EMAILS_block_title',
        ),
        UNBLOCK: this.$translate.instant(
          'hosting_tab_AUTOMATED_EMAILS_unblock_title',
        ),
        PURGE: this.$translate.instant(
          'hosting_tab_AUTOMATED_EMAILS_purge_title',
        ),
      };

      this.isLoading = false;

      this.$scope.submitting = () => this.submitting();
      this.$scope.title = this.titles[this.action];
    }

    submitting() {
      this.isLoading = true;

      return this.HostingAutomatedEmails.postRequest(
        this.$stateParams.productId,
        this.action,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_AUTOMATED_EMAILS_request_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_AUTOMATED_EMAILS_request_error',
            ),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.isLoading = false;
          this.$scope.resetAction();
        });
    }
  },
);
