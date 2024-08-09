angular.module('App').controller(
  'HostingTabDomainsMultisiteLogs',
  class HostingTabDomainsMultisiteLogs {
    /* @ngInject */
    constructor(
      $http,
      $q,
      $scope,
      $stateParams,
      $window,
      Hosting,
      HostingStatistics,
    ) {
      this.$http = $http;
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$window = $window;
      this.Hosting = Hosting;
      this.HostingStatistics = HostingStatistics;
    }

    generateLogHref(row) {
      const domain = this.$scope.domains.list.results.find(
        (item) => item.domain === row.domain,
      );
      if (!domain.logUrlGenerated && !domain.logsLoading) {
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
      return null;
    }

    goToGeneratedLogHref(url) {
      this.$window.open(url, '_blank', 'noopener');
    }
  },
);
