import clone from 'lodash/clone';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

export default class EmailDomainEmailResponderCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $timeout,
    $translate,
    Alerter,
    emails,
    goToEmail,
    quotas,
    WucEmails,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.emails = emails;
    this.goToEmail = goToEmail;
    this.quotas = quotas;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.loading = {
      responders: false,
      pager: false,
    };

    this.productId = this.$stateParams.productId;

    this.$scope.$on('hosting.tabs.emails.responders.refresh', () =>
      this.refreshTableResponders(),
    );

    this.$scope.$on('$destroy', () => this.WucEmails.killPollResponderTasks());

    this.refreshTableResponders();
  }

  static isExpired(responder) {
    if (!responder.to) {
      return false;
    }
    return moment(new Date(responder.to)).isBefore(new Date());
  }

  refreshTableResponders() {
    this.loading.responders = true;
    this.responders = null;

    return this.WucEmails.getResponders(this.productId)
      .then((data) => {
        this.responders = map(data.sort(), (account) => ({ account }));
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_table_responders_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading.responders = false;
      });
  }

  transformItem({ account }) {
    return this.WucEmails.getResponder(this.productId, account)
      .then((responder) =>
        this.$q.all([
          responder,
          this.WucEmails.getResponderTasks(this.productId, account),
        ]),
      )
      .then(([responder, tasks]) => {
        const displayedResponder = clone(responder);
        const actionsDisabled = !isEmpty(tasks);
        if (actionsDisabled) {
          this.pollResponder(displayedResponder);
        }
        displayedResponder.actionsDisabled = actionsDisabled;
        return displayedResponder;
      });
  }

  pollResponder(responder) {
    return this.WucEmails.pollResponderTasks(
      this.productId,
      responder.account,
    ).then(() => {
      const newResponder = clone(responder);
      const responderIndex = findIndex(
        this.responders,
        (item) => item.account === responder.account,
      );
      newResponder.actionsDisabled = false;
      this.responders.splice(responderIndex, 1, newResponder);
      return newResponder;
    });
  }
}
