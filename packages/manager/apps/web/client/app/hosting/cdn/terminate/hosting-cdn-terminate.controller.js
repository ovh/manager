import get from 'lodash/get';

export default class HostingTerminateCdnCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, atInternet, Hosting, Alerter) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Hosting = Hosting;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.atInternet.trackPage({ name: 'web::hosting::cdn::terminate' });
    this.$scope.terminateCdn = () => this.terminateCdn();
  }

  terminateCdn() {
    this.atInternet.trackClick({
      name: 'web::hosting::cdn::terminate::confirm',
      type: 'action',
    });

    this.Hosting.terminateCdn(this.$stateParams.productId)
      .then(() => {
        this.Alerter.success(
          this.$translate.instant(
            'hosting_dashboard_service_terminate_cdn_success',
          ),
          this.$scope.alerts.main,
        );
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'hosting_dashboard_service_terminate_cdn_error',
          ),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.$scope.resetAction();
      });
  }
}
