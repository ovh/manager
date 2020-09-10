angular.module('App').controller(
  'HostingTabDomainsMultisiteLogs',
  class HostingTabDomainsMultisiteLogs {
    constructor(
      $q,
      $scope,
      $stateParams,
      $translate,
      Alerter,
      Hosting,
      HostingStatistics,
      constants,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.HostingStatistics = HostingStatistics;
      this.constants = constants;
    }

    $onInit() {
      this.$scope.$on('popover.show', (evt, elm) => {
        const domain = this.$scope.domains.list.results[
          elm['0'].dataset.domainIndex
        ];
        if (!domain.logUrlGenerated && !domain.logsLoading) {
          this.generateLogHref(domain);
        }
      });
    }

    /* eslint-disable no-param-reassign */
    generateLogHref(domain) {
      domain.logsLoading = true;
      this.$q
        .all({
          ownLogs: this.HostingStatistics.getLogs(
            this.$stateParams.productId,
            domain.name,
          ),
          userLogsToken: this.Hosting.getUserLogsToken(
            this.$stateParams.productId,
            {
              params: {
                attachedDomain: domain.name,
                remoteCheck: true,
              },
            },
          ),
        })
        .then(({ ownLogs, userLogsToken }) => {
          if (ownLogs.logs) {
            domain.logUrl = `${ownLogs.logs}?token=${userLogsToken}`;
            domain.logUrlGenerated = true;
          }
        })
        .catch(() => {
          this.Alerter.error(
            this.$translate.instant(
              'hosting_tab_DOMAINS_multisite_logs_generation_error',
            ),
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          domain.logsLoading = false;
        });
    }
    /* eslint-enable no-param-reassign */
  },
);
