angular.module('App').controller(
  'hostingRegenerateSSLCtrl',
  class HostingRegenerateSSLCtrl {
    /* @ngInject */
    constructor(
      $rootScope,
      $scope,
      $stateParams,
      $translate,
      hostingSSLCertificate,
      Alerter,
    ) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.hostingSSLCertificate = hostingSSLCertificate;
    }

    $onInit() {
      this.$scope.regeneratingCertificate = () =>
        this.regeneratingCertificate();
    }

    regeneratingCertificate() {
      return this.hostingSSLCertificate
        .regeneratingCertificate(this.$stateParams.productId)
        .then(() => {
          this.hostingSSLCertificate.reload();
          this.Alerter.success(
            this.$translate.instant(
              'hosting_dashboard_service_regenerate_ssl_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_dashboard_service_regenerate_ssl_error',
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
