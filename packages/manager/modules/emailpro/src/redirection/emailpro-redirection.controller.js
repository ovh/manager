import get from 'lodash/get';
import set from 'lodash/set';

export default class EmailMXPlanEmailRedirectionCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $q,
    $translate,
    Alerter,
    WucEmails,
    iceberg,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
    this.iceberg = iceberg;
  }

  $onInit() {
    this.loading = {
      exportCSV: false,
      quotas: true,
      redirections: true,
    };
    this.redirectionsDetails = [];

    this.$scope.$on('hosting.tabs.emails.redirections.refresh', () =>
      this.refreshTableRedirections(),
    );
    this.getQuotas().then(() => this.refreshTableRedirections());
  }

  getQuotas() {
    this.loading.quotas = true;
    return this.WucEmails.getQuotas(
      get(this.$scope, 'exchange.associatedDomainName'),
    )
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

  getDatasToExport() {
    this.loading.exportCSV = true;

    const dataToExport = [
      [
        this.$translate.instant('emails_common_from'),
        this.$translate.instant('emails_common_to'),
      ],
    ];

    return this.iceberg('/email/domain/:domain/redirection')
      .query()
      .expand('CachedObjectList-Pages')
      .execute({
        domain: get(this.$scope, 'exchange.associatedDomainName'),
      })
      .$promise.then((result) => {
        result.data
          .sort((a, b) => {
            if (a.from === b.from) {
              return a.to > b.to ? 1 : -1;
            }
            return a.from > b.from ? 1 : -1;
          })
          .forEach((redirection) => {
            dataToExport.push([redirection.from, redirection.to]);
          });
        return dataToExport;
      })
      .finally(() => {
        this.loading.exportCSV = false;
      });
  }

  refreshTableRedirections() {
    this.loading.redirections = true;
    this.redirections = null;

    return this.iceberg('/email/domain/:domain/redirection')
      .query()
      .expand('CachedObjectList-Pages')
      .execute({
        domain: get(this.$scope, 'exchange.associatedDomainName'),
      })
      .$promise.then((result) => {
        this.redirections = result.data.sort((a, b) => {
          if (a.from === b.from) {
            return a.to > b.to ? 1 : -1;
          }
          return a.from > b.from ? 1 : -1;
        });
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_table_redirections_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading.redirections = false;
      });
  }
}
