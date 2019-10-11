import get from 'lodash/get';

export default class HostingFlushCdnCtrl {
  /* @ngInject */
  constructor($scope, $rootScope, $stateParams, $translate, Hosting, Alerter) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Hosting = Hosting;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.loading = false;
    this.$scope.flushCdn = () => this.flushCdn();
  }

  flushCdn() {
    this.Hosting.flushCdn(this.$stateParams.productId)
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('hosting_dashboard_cdn_flush_success'),
          this.$scope.alerts.main,
        );
        this.$rootScope.$broadcast('hosting.cdn.flush.refresh');
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('hosting_dashboard_cdn_flush_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.$scope.resetAction();
      });
  }
}
