import filter from 'lodash/filter';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';
import toPairs from 'lodash/toPairs';

angular.module('App').controller(
  'hostingSSLDetailsController',
  class HostingSSLDetailsController {
    /* @ngInject */
    constructor($scope, $translate, Alerter, constants, hostingSSLCertificate) {
      this.$scope = $scope;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.constants = constants;
      this.hostingSSLCertificate = hostingSSLCertificate;
    }

    $onInit() {
      this.hosting = this.$scope.currentActionData;
      this.comodoConstants = this.constants.comodo;
      this.sectigoConstants = this.constants.sectigo;
      return this.retrievingCertificateValidationReport();
    }

    retrievingCertificateValidationReport() {
      this.isLoading = true;

      return this.hostingSSLCertificate
        .retrievingCertificateValidationReport(this.hosting.serviceName)
        .then((sslReport) => {
          this.orderNumber = sslReport.providerOrderId;

          this.sslReport = filter(
            map(toPairs(sslReport), (sslReportEntry) => ({
              name: sslReportEntry[0],
              value: sslReportEntry[1],
            })),
            (sslReportEntry) =>
              sslReportEntry.value !== 'non-required' &&
              sslReportEntry.value !== 'not-applicable' &&
              sslReportEntry.name !== 'providerOrderId' &&
              !startsWith(sslReportEntry.name, '$'),
          );
        })
        .catch((error) => {
          this.Alerter.error(
            this.$translate.instant('hosting_dashboard_ssl_details_error'),
            error.data.message,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
);
