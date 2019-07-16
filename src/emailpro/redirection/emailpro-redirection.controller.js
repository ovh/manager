angular.module('App').controller(
  'EmailMXPlanEmailRedirectionCtrl',
  class EmailMXPlanEmailRedirectionCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $stateParams
     * @param $q
     * @param $translate
     * @param Alerter
     * @param WucEmails
     */
    constructor($scope, $stateParams, $q, $translate, Alerter, WucEmails) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$q = $q;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.WucEmails = WucEmails;
    }

    $onInit() {
      this.loading = {
        exportCSV: false,
        quotas: true,
        redirections: true,
      };
      this.redirectionsDetails = [];

      this.$scope.$on('hosting.tabs.emails.redirections.refresh', () => this.refreshTableRedirections());
      this.getQuotas().then(() => this.refreshTableRedirections());
    }

    getQuotas() {
      this.loading.quotas = true;
      return this.WucEmails.getQuotas(_.get(this.$scope, 'exchange.associatedDomainName'))
        .then((quotas) => {
          this.quotas = quotas;
        })
        .catch((err) => {
          _.set(err, 'type', err.type || 'ERROR');
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

      return this.$q
        .all(_.map(
          this.redirections,
          ({ id }) => this.WucEmails.getRedirection(_.get(this.$scope, 'exchange.associatedDomainName'), id),
        ))
        .then(data => dataToExport.concat(_.map(data, d => [d.from, d.to])))
        .finally(() => {
          this.loading.exportCSV = false;
        });
    }

    refreshTableRedirections() {
      this.loading.redirections = true;
      this.redirections = null;

      return this.WucEmails.getRedirections(_.get(this.$scope, 'exchange.associatedDomainName'))
        .then((data) => {
          this.redirections = data.map(id => ({ id }));
        })
        .catch(err => this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_table_redirections_error'),
          err,
          this.$scope.alerts.main,
        ))
        .finally(() => {
          this.loading.redirections = false;
        });
    }

    transformItem({ id }) {
      return this.WucEmails.getRedirection(_.get(this.$scope, 'exchange.associatedDomainName'), id);
    }
  },
);
