angular.module('App').controller(
  'EmailProMXPlanMailingListsCreateSubscriberCtrl',
  class EmailProMXPlanMailingListsCreateSubscriberCtrl {
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

      this.$scope.createSubscriber = () => this.createSubscriber();
    }

    static addressValidator(addr) {
      return validator.isEmail(addr) && /^[\w@.-]+$/.test(addr);
    }

    createSubscriber() {
      this.loading = true;
      const subscribersToAdd = _.uniq(this.selection);

      return this.EmailProMXPlanMailingLists.addSubscribers(_.get(this.$scope, 'exchange.associatedDomainName'), {
        mailingList: this.mailingList.name,
        users: subscribersToAdd,
        type: 'subscriber',
      })
        .then((tasks) => {
          const task = tasks.pop();

          this.Alerter.alertFromSWSBatchResult(
            {
              OK: this.$translate.instant(subscribersToAdd.length === 1
                ? 'mailing_list_tab_modal_create_subscriber_success'
                : 'mailing_list_tab_modal_create_subscribers_success'),
              PARTIAL: this.$translate.instant('mailing_list_tab_modal_create_subscribers_error'),
              ERROR: this.$translate.instant('mailing_list_tab_modal_create_subscribers_error'),
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
            this.$translate.instant(subscribersToAdd.length === 1
              ? 'mailing_list_tab_modal_create_subscriber_error'
              : 'mailing_list_tab_modal_create_subscribers_error'),
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
