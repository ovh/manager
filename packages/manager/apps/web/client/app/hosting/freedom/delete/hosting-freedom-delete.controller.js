angular.module('App').controller(
  'HostingDeleteFreedomCtrl',
  class HostingDeleteFreedomCtrl {
    constructor($scope, $stateParams, $translate, Alerter, HostingFreedom) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.HostingFreedom = HostingFreedom;
    }

    $onInit() {
      this.freedom = angular.copy(this.$scope.currentActionData);

      this.$scope.deleteFreedom = () => this.deleteFreedom();
    }

    deleteFreedom() {
      this.$scope.resetAction();
      return this.HostingFreedom.deleteFreedom(
        this.$stateParams.productId,
        this.freedom.domain,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_dashboard_service_delete_freedom_success',
              {
                t0: this.freedom.domain,
              },
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_FREEDOM_error'),
            err,
            this.$scope.alerts.main,
          );
        });
    }
  },
);
