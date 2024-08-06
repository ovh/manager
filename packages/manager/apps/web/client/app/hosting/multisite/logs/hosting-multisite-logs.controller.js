angular.module('App').controller(
  'HostingTabDomainsMultisiteLogs',
  class HostingTabDomainsMultisiteLogs {
    /* @ngInject */
    constructor(
      $http,
      $q,
      $scope,
      $stateParams,
      $translate,
      Alerter,
      Hosting,
      HostingStatistics,
      constants,
    ) {
      this.$http = $http;
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

      return this.$http
        .get(
          `/hosting/web/${this.$stateParams.productId}/attachedDomain/${domain.name}`,
        )
        .then(({ data }) => data.ownLog)
        .then((fqdn) =>
          this.$q.all({
            ownLogs: this.HostingStatistics.getLogs(
              this.$stateParams.productId,
              fqdn,
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
          }),
        )
        .then(({ ownLogs, userLogsToken }) => {
          if (ownLogs.logs) {
            domain.logUrl = `${ownLogs.logs}?token=${userLogsToken}`;
            domain.logUrlGenerated = true;
          }
        })
        .catch(() => {
          domain.logUrl = null;
        })
        .finally(() => {
          domain.logsLoading = false;
        });
    }
    /* eslint-enable no-param-reassign */
  },
);
