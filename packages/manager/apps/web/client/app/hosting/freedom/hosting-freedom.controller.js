import isEmpty from 'lodash/isEmpty';

angular.module('App').controller(
  'HostingFreedomTabCtrl',
  class HostingFreedomTabCtrl {
    constructor(
      $scope,
      $rootScope,
      $location,
      $stateParams,
      $translate,
      Alerter,
      HostingFreedom,
    ) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$location = $location;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.HostingFreedom = HostingFreedom;
    }

    $onInit() {
      this.filter = {
        status: null,
      };
      this.loading = false;

      this.$scope.$on('hosting.web.freedom.delete', () => {
        this.refreshTableFreedoms(true);
      });

      this.HostingFreedom.getModels()
        .then((model) => {
          this.statusEnum = model.models['hosting.web.freedom.StatusEnum'].enum;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_FREEDOM_error'),
            err,
            this.$scope.alerts.main,
          );
        });
    }

    setSelectedProduct(domain) {
      this.$rootScope.$broadcast('leftNavigation.selectProduct.fromName', {
        name: domain,
        type: 'DOMAIN',
      });
    }

    refreshTableFreedoms(forceRefresh = false) {
      this.loading = true;
      this.freedomIds = null;

      let params = {};
      if (this.filter.status) {
        params = { status: this.filter.status };
      }

      this.HostingFreedom.getFreedoms(this.$stateParams.productId, {
        params,
        forceRefresh,
      })
        .then((ids) => {
          this.freedomIds = ids;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_FREEDOM_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          if (isEmpty(this.freedomIds)) {
            this.loading = false;
          }
        });
    }

    transformItem(item) {
      return this.HostingFreedom.getFreedom(this.$stateParams.productId, {
        domain: item,
      });
    }

    onTransformItemDone() {
      this.loading = false;
    }
  },
);
