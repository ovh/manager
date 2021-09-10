import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

export default class EmailDelegateResponderCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    Alerter,
    goToDelegations,
    WucEmails,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.goToDelegations = goToDelegations;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.loading = {
      responders: false,
    };

    this.$scope.$on('hosting.tabs.delegate.responders.refresh', () =>
      this.refreshTableResponders(),
    );

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
    this.emailsList = null;
    this.accounts = [];

    return this.WucEmails.getDelegatedEmails(this.$stateParams.productId)
      .then((data) => {
        this.accounts = map(data, (email) => email.split('@')[0]);
        this.emailsList = data.sort();
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_table_accounts_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        if (isEmpty(this.emailsList)) {
          this.loading.responders = false;
        }
      });
  }

  transformItem(item) {
    return this.WucEmails.getDelegatedResponder(item);
  }

  onTransformItemDone() {
    this.loading.responders = false;
  }
}
