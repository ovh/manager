class DedicatedCloudSubDatacentersDeleteCtrl {
  constructor($scope, $stateParams, $translate, DedicatedCloud) {
    this.$scope = $scope;
    this.DedicatedCloud = DedicatedCloud;

    this.datacenterId = $scope.currentActionData;

    this.$scope.loading = false;

    this.$scope.deleteDatacenter = () => {
      this.$scope.loading = true;
      this.DedicatedCloud.deleteDatacenter($stateParams.productId, this.datacenterId)
        .then(() => {
          this.$scope.setMessage($translate.instant('dedicatedCloud_datacenter_delete_success', { t0: this.datacenterId }), true);
        })
        .catch((err) => {
          const data = { ...err, type: 'ERROR' };
          this.$scope.setMessage($translate.instant('dedicatedCloud_datacenter_delete_error', { t0: this.datacenterId }), data);
        })
        .finally(() => {
          this.$scope.resetAction();
          this.$scope.loading = false;
        });
    };
  }
}

angular.module('App').controller('DedicatedCloudSubDatacentersDeleteCtrl', DedicatedCloudSubDatacentersDeleteCtrl);
