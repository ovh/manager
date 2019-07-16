angular.module('App').controller(
  'EmailProMXPlanMailingListsDeleteSubscribersCtrl',
  class EmailProMXPlanMailingListsDeleteSubscribersCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $translate
     * @param Alerter
     * @param EmailProMXPlanMailingLists
     */
    constructor($scope, $translate, Alerter, EmailProMXPlanMailingLists) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.EmailProMXPlanMailingLists = EmailProMXPlanMailingLists;
    }

    $onInit() {
      this.errors = [];
      this.mailingList = angular.copy(this.$scope.currentActionData.mailingList);
      this.subscribers = angular.copy(this.$scope.currentActionData.subscribers);
      this.loading = false;
      this.selection = [];

      this.$scope.deleteSubscribers = () => this.deleteSubscribers();
    }

    static addressValidator(addr) {
      return validator.isEmail(addr) && /^[\w@.-]+$/.test(addr);
    }

    deleteSubscribers() {
      this.loading = true;
      const subscribersToDelete = _.uniq(this.selection);

      return this.EmailProMXPlanMailingLists.deleteSubscribers(_.get(this.$scope, 'exchange.associatedDomainName'), {
        mailingList: this.mailingList.name,
        users: subscribersToDelete,
        type: 'subscriber',
      })
        .then((tasks) => {
          const task = tasks.pop();

          this.Alerter.alertFromSWSBatchResult(
            {
              OK: this.$translate.instant(subscribersToDelete.length === 1
                ? 'mailing_list_tab_modal_subscriber_delete_success'
                : 'mailing_list_tab_modal_subscribers_delete_success'),
              PARTIAL: this.$translate.instant('mailing_list_tab_modal_subscribers_delete_error'),
              ERROR: this.$translate.instant('mailing_list_tab_modal_subscribers_delete_error'),
            },
            task,
            this.$scope.alerts.main,
          );

          this.EmailProMXPlanMailingLists.pollState(this.$scope.exchange.associatedDomainName, {
            id: task.task,
            successStates: ['noState'],
            namespace: 'EmailProMXPlanMailingLists.subscribers.poll',
          });
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(subscribersToDelete.length === 1
              ? 'mailing_list_tab_modal_subscriber_delete_error'
              : 'mailing_list_tab_modal_subscribers_delete_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
