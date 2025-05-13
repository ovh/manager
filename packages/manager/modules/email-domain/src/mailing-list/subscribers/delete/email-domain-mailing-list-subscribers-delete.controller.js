import uniq from 'lodash/uniq';
import validator from 'validator';

export default class MailingListsDeleteSubscribersCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, MailingLists) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.MailingLists = MailingLists;
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
    const subscribersToDelete = uniq(this.selection);

    return this.MailingLists.deleteSubscribers(this.$stateParams.productId, {
      mailingList: this.mailingList.name,
      users: subscribersToDelete,
      type: 'subscriber',
    })
      .then((tasks) => {
        const task = tasks.pop();

        this.Alerter.alertFromSWSBatchResult(
          {
            OK: this.$translate.instant(
              subscribersToDelete.length === 1
                ? 'mailing_list_tab_modal_subscriber_delete_success'
                : 'mailing_list_tab_modal_subscribers_delete_success',
            ),
            PARTIAL: this.$translate.instant(
              'mailing_list_tab_modal_subscribers_delete_error',
            ),
            ERROR: this.$translate.instant(
              'mailing_list_tab_modal_subscribers_delete_error',
            ),
          },
          task,
          this.$scope.alerts.main,
        );

        this.MailingLists.pollState(this.$stateParams.productId, {
          id: task.task,
          successStates: ['noState'],
          namespace: 'mailingLists.subscribers.poll',
        });
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            subscribersToDelete.length === 1
              ? 'mailing_list_tab_modal_subscriber_delete_error'
              : 'mailing_list_tab_modal_subscribers_delete_error',
          ),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loading = false;
        this.$scope.resetAction();
      });
  }
}
