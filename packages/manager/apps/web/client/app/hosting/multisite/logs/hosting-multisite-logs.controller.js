import isString from 'lodash/isString';

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
            domain.logUrl = `${this.$scope.logs.logs}?token=${result}`;
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
