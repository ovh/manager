angular.module('App').controller(
  'EmailDomainEmailRedirectionCtrl',
  class EmailDomainEmailRedirectionCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $stateParams
     * @param $q
     * @param $translate
     * @param Alerter
     * @param iceberg
     */
    constructor($scope, $stateParams, $q, $translate, Alerter, iceberg) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$q = $q;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.iceberg = iceberg;
    }

    $onInit() {
      this.loading = {
        exportCSV: false,
        redirections: false,
      };
      this.redirectionsDetails = [];

      this.$scope.$on('hosting.tabs.emails.redirections.refresh', () =>
        this.refreshTableRedirections(),
      );

      this.refreshTableRedirections();
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
          domain: this.$stateParams.productId,
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
          domain: this.$stateParams.productId,
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
  },
);
