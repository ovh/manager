export default class EmailDomainEmailFilterCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    Alerter,
    email,
    emails,
    goToEmail,
    WucEmails,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.email = email;
    this.emails = emails;
    this.goToEmail = goToEmail;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.currentAccount = this.email || null;

    this.$scope.$on('hosting.tabs.emails.filters.refresh', () =>
      this.refreshTableFilters(),
    );

    this.refreshTableFilters();
  }

  refreshTableFilters() {
    this.filters = null;

    return this.WucEmails.getFilters(
      this.$stateParams.productId,
      this.currentAccount.accountName,
    )
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
    return this.WucEmails.getFilter(
      this.$stateParams.productId,
      this.currentAccount.accountName,
      name,
    );
  }
}
