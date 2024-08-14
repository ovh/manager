angular.module('App').controller(
  'hostingDeleteSslCtrl',
  class HostingDeleteSslCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $stateParams,
      $translate,
      Alerter,
      hostingSSLCertificate,
      hostingSSLCertificateType,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.hostingSSLCertificate = hostingSSLCertificate;
      this.hostingSSLCertificateType = hostingSSLCertificateType;
    }

    $onInit() {
      this.wasCertificateFree = this.hostingSSLCertificateType.constructor.getCertificateTypeByProvider(
        this.$scope.currentActionData.provider,
      ).isFree;

      this.$scope.deletingCertificate = () => this.deletingCertificate();
    }

    deletingCertificate() {
      return this.hostingSSLCertificate
        .deletingCertificate(this.$stateParams.productId)
        .then(() => {
          this.hostingSSLCertificate.reload();
          this.Alerter.success(
            this.$translate.instant(
              'hosting_dashboard_service_delete_ssl_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_dashboard_service_delete_ssl_error',
            ),
            err.data,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  },
);
