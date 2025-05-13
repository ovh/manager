import isEmpty from 'lodash/isEmpty';

angular.module('App').controller(
  'HostingIndyTabCtrl',
  class HostingIndyTabCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $location,
      $stateParams,
      $translate,
      Alerter,
      HostingIndy,
    ) {
      this.$scope = $scope;
      this.$location = $location;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.HostingIndy = HostingIndy;
    }

    $onInit() {
      this.filter = {
        login: '',
      };
      this.loading = false;
    }

    goSearch() {
      this.refreshTableIndys();
    }

    resetSearch() {
      this.filter.login = '';
      this.refreshTableIndys();
    }

    selectAttachedDomain(domain) {
      this.$location.search('domain', domain);
      this.$scope.setSelectedTab('DOMAINS');
    }

    refreshTableIndys(forceRefresh = false) {
      this.loading = true;
      this.indyIds = null;

      let params = {};
      if (this.filter.login) {
        params = { login: `%${this.filter.login}%` };
      }

      this.HostingIndy.getIndys(this.$stateParams.productId, {
        params,
        forceRefresh,
      })
        .then((ids) => {
          this.indyIds = ids;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_INDY_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          if (isEmpty(this.indyIds)) {
            this.loading = false;
          }
        });
    }

    transformItem(item) {
      return this.HostingIndy.getIndy(this.$stateParams.productId, {
        login: item,
      });
    }

    onTransformItemDone() {
      this.loading = false;
    }
  },
);
