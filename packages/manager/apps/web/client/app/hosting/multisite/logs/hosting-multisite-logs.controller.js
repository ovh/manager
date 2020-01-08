import isString from 'lodash/isString';
import startsWith from 'lodash/startsWith';

angular.module('App').controller(
  'HostingTabDomainsMultisiteLogs',
  class HostingTabDomainsMultisiteLogs {
    constructor($scope, $stateParams, $translate, Alerter, Hosting, constants) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.constants = constants;
    }

    $onInit() {
      this.$scope.$on('popover.show', (evt, elm) => {
        const domain = this.$scope.domains.list.results[
          elm['0'].dataset.domainIndex
        ];
        if (!domain.logUrlGenerated) {
          this.generateLogHref(domain);
        }
      });
    }

    /* eslint-disable no-param-reassign */
    generateLogHref(domain) {
      domain.logUrlGenerated = true;
      if (isString(domain.ownLog) && !domain.ownLogToken) {
        domain.logsLoading = true;
        this.Hosting.getUserLogsToken(this.$stateParams.productId, {
          params: { attachedDomain: domain.name, remoteCheck: true },
        })
          .then((result) => {
            if (startsWith(this.$scope.hostingProxy.datacenter, 'gra')) {
              domain.logUrl = `${URI.expand(this.constants.stats_logs_gra, {
                cluster: this.$scope.hostingProxy.cluster,
                serviceName: domain.ownLog,
              }).toString()}?token=${result}`;
            } else {
              domain.logUrl = `${URI.expand(this.constants.stats_logs, {
                serviceName: domain.ownLog,
              }).toString()}?token=${result}`;
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
      return false;
    }
    /* eslint-enable no-param-reassign */
  },
);
