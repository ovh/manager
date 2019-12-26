angular.module('App').controller(
  'DedicatedCloudSubDatacenterVeeamCtrl',
  class {
    /* @ngInject */
    constructor(
      $rootScope,
      $scope,
      $stateParams,
      $translate,
      currentService,
      DedicatedCloud,
      VEEAM_STATE_ENUM,
    ) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.currentService = currentService;
      this.DedicatedCloud = DedicatedCloud;
      this.VEEAM_STATE_ENUM = VEEAM_STATE_ENUM;
    }

    $onInit() {
      this.$scope.veeam = {
        model: null,
        constants: this.VEEAM_STATE_ENUM,
      };

      this.$scope.loading = false;
      this.$scope.currentService = this.currentService;

      this.$rootScope.$on('datacenter.veeam.reload', () => {
        this.loadVeeam(true);
      });

      return this.fetchInitialData();
    }

    fetchInitialData() {
      this.$scope.loading = true;

      return this.loadLicences()
        .then(() => this.loadVeeam())
        .catch((data) => {
          this.$scope.setMessage(
            this.$translate.instant('dedicatedCloud_tab_veeam_loading_error'),
            {
              ...data,
              type: 'ERROR',
            },
          );
        })
        .finally(() => {
          this.$scope.loading = false;
        });
    }

    loadLicences() {
      return this.DedicatedCloud.getDatacenterLicence(
        this.$stateParams.productId,
        this.currentService.usesLegacyOrder,
      ).then(({ isSplaActive }) => {
        this.$scope.isSplaActive = isSplaActive;
      });
    }

    loadVeeam(forceRefresh) {
      return this.DedicatedCloud.getVeeam(
        this.$stateParams.productId,
        this.$stateParams.datacenterId,
        forceRefresh,
      ).then((veeam) => {
        this.$scope.veeam.model = veeam;
      });
    }
  },
);
