angular.module('App').controller(
  'EmailProMXPlanMailingListsDeleteSubscriberCtrl',
  class EmailProMXPlanMailingListsDeleteSubscriberCtrl {
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
      this.mailingList = this.$scope.currentActionData.mailingList;
      this.subscribers = this.$scope.currentActionData.subscribers;
      this.loading = false;

      this.$scope.deleteSubscribers = () => this.deleteSubscribers();
    }

    deleteSubscribers() {
      this.loading = true;

      return this.EmailProMXPlanMailingLists.deleteSubscribers(_.get(this.$scope, 'exchange.associatedDomainName'), {
        mailingList: this.mailingList.name,
        users: this.subscribers,
        type: 'subscriber',
      })
        .then((tasks) => {
          const task = tasks.pop();

          this.Alerter.alertFromSWSBatchResult(
            {
              OK: this.$translate.instant(this.subscribers.length === 1
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
            mailingList: this.mailingList,
            successStates: ['noState'],
            namespace: 'EmailProMXPlanMailingLists.subscribers.poll',
          });
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(this.subscribers.length === 1
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
