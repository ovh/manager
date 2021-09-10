import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

export default class MailingListsTabModulesCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $scope,
    $state,
    $stateParams,
    $translate,
    Alerter,
    goToModerators,
    goToSubscribers,
    MailingLists,
    WucEmails,
  ) {
    this.$filter = $filter;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.goToModerators = goToModerators;
    this.goToSubscribers = goToSubscribers;
    this.MailingLists = MailingLists;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.mailingListsDetails = [];
    this.loading = {
      mailingLists: false,
      pager: false,
      quotas: false,
    };
    this.search = {
      mailingLists: '',
    };

    this.$scope.$on('hosting.tabs.mailingLists.refresh', () =>
      this.refreshTableMailingLists(true),
    );
    this.$scope.$on('mailingLists.update.poll.done', () =>
      this.refreshTableMailingLists(true),
    );
    this.$scope.$on('$destroy', () => {
      this.Alerter.resetMessage(this.$scope.alerts.tabs);
      this.MailingLists.killAllPolling({
        namespace: 'mailingLists.update.poll',
      });
    });

    this.getQuotas().then(() => this.refreshTableMailingLists());
  }

  //---------------------------------------------
  // Search
  //---------------------------------------------

  emptySearch() {
    this.search.mailingLists = '';
    this.refreshTableMailingLists(true);
  }

  goSearch() {
    this.refreshTableMailingLists(true);
  }

  //---------------------------------------------
  // Mailing lists
  //---------------------------------------------

  getQuotas() {
    this.loading.quotas = true;
    return this.WucEmails.getQuotas(this.$stateParams.productId)
      .then((quotas) => {
        this.quotas = quotas;
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
          err,
          this.$scope.alerts.tabs,
        );
      })
      .finally(() => {
        this.loading.quotas = false;
      });
  }

  refreshTableMailingLists(forceRefresh) {
    this.loading.mailingLists = true;
    this.mailingLists = null;

    return this.MailingLists.getMailingLists(this.$stateParams.productId, {
      name: `%${this.search.mailingLists}%`,
      forceRefresh,
    })
      .then((data) => {
        this.mailingLists = this.$filter('orderBy')(data);
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        if (isEmpty(this.mailingLists)) {
          this.loading.mailingLists = false;
        }
      });
  }

  transformItem(item) {
    return this.MailingLists.getMailingList(this.$stateParams.productId, item);
  }

  onTransformItemDone() {
    this.loading.mailingLists = false;
    this.loading.pager = false;
  }
}
