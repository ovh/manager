import clone from 'lodash/clone';
import isEmpty from 'lodash/isEmpty';
import round from 'lodash/round';
import set from 'lodash/set';

export default class EmailDelegateCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $stateParams,
    $timeout,
    $translate,
    Alerter,
    goToFilters,
    goToResponder,
    WucEmails,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.goToFilters = goToFilters;
    this.goToResponder = goToResponder;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.domain = this.$stateParams.productId || '';
    this.emailsDetails = [];
    this.loading = {
      accounts: false,
      search: false,
      usage: false,
    };
    this.search = { accounts: null };
    this.stepPath = '';

    this.$scope.alerts = {
      page: 'domain_alert_page',
      main: 'domain_alert_main',
    };
    this.$scope.currentAction = null;
    this.$scope.currentActionData = null;
    this.$scope.itemsPerPage = 10;

    // Modal action
    this.$scope.resetAction = () => this.$scope.setAction(false);
    this.$scope.setAction = (action, data) => {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data || null;

      if (action) {
        this.stepPath = `${this.$scope.currentAction}.html`;
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        this.$timeout(() => {
          this.stepPath = '';
        }, 300);
      }
    };

    this.$scope.$on('hosting.tabs.emails.delegate.refresh', () =>
      this.loadEmails(),
    );

    this.loadEmails();
  }

  /* Search */
  emptySearch() {
    this.search.accounts = '';
    this.loading.search = true;
    this.loadEmails();
  }

  goSearch() {
    this.loading.search = true;
    this.loadEmails();
  }

  /* Accounts */
  loadEmails() {
    this.loading.accounts = true;
    this.emails = null;

    this.WucEmails.getDelegatedEmails(
      this.$stateParams.productId,
      `%${this.search.accounts || ''}%`,
    )
      .then((data) => {
        this.emails = data.sort();
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_table_accounts_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        if (isEmpty(this.emails)) {
          this.loading.accounts = false;
          this.loading.search = false;
        }
      });
  }

  transformItem(item) {
    return this.$q
      .all({
        email: this.WucEmails.getDelegatedEmail(item),
        usage: this.WucEmails.getEmailDelegatedUsage(item).catch(() => null),
      })
      .then(({ email, usage }) => {
        const emailData = clone(email);

        if (usage) {
          emailData.quota = usage.quota;
          emailData.emailCount = usage.emailCount;
          emailData.date = usage.date;
        }

        this.constructor.setAccountPercentUse(emailData);

        return emailData;
      });
  }

  onTransformItemDone() {
    this.loading.accounts = false;
    this.loading.search = false;
  }

  /**
   * Update selected Email usage
   * @param {object} account
   */
  updateUsage(account) {
    this.loading.usage = true;
    this.WucEmails.updateDelegatedUsage(account.email)
      .then(() =>
        this.WucEmails.getEmailDelegatedUsage(account.email).then(() =>
          this.constructor.setAccountPercentUse(account),
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
        this.loading.usage = false;
      });
  }

  static setAccountPercentUse(account) {
    set(
      account,
      'percentUse',
      account.size > 0 ? round((account.quota * 100) / account.size) : 0,
    );
  }
}
