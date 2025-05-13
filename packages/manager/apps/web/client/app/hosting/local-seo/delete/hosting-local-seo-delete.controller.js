angular.module('App').controller(
  'HostingLocalSeoDeleteCtrl',
  class HostingLocalSeoDeleteCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, Alerter, HostingLocalSeo) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.HostingLocalSeo = HostingLocalSeo;
    }

    $onInit() {
      this.productId = this.$stateParams.productId;
      this.location = angular.copy(this.$scope.currentActionData);
      this.loading = false;
    }

    deleteLocation() {
      this.loading = true;
      return this.HostingLocalSeo.deleteLocation(
        this.productId,
        this.location.id,
      )
        .then(() =>
          this.Alerter.success(
            this.$translate.instant('hosting_tab_LOCAL_SEO_delete_success'),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_LOCAL_SEO_delete_error'),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
