export default class EmailDelegateFilterCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    Alerter,
    email,
    emails,
    goToDelegations,
    WucEmails,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.goToDelegations = goToDelegations;
    this.WucEmails = WucEmails;

    this.currentAccount = email || {};
    this.accounts = emails || [];
  }

  $onInit() {
    this.$scope.$on('hosting.tabs.emails.delegatedFilters.refresh', () =>
      this.refreshTableFilters(),
    );

    this.refreshTableFilters();
  }

  refreshTableFilters() {
    this.filters = null;

    return this.WucEmails.getDelegatedFilters(this.currentAccount.email)
      .then((data) => {
        this.filters = data.map((name) => ({ name }));
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_table_filters_error'),
          err,
          this.$scope.alerts.main,
        ),
      );
  }

  transformItem({ name }) {
    return this.WucEmails.getDelegatedFilter(this.currentAccount.email, name);
  }
}
