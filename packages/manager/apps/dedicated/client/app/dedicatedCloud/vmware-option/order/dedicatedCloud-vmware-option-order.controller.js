import assign from 'lodash/assign';
import pick from 'lodash/pick';

angular.module('App').controller('DedicatedCloudOrderVMwareOptionCtrl', ($scope, $stateParams, $rootScope, $q, $translate, DedicatedCloud, Alerter) => {
  $scope.option = $scope.currentActionData;

  $scope.loaders = {
    loading: false,
  };

  $scope.loadPrices = function loadPrices() {
    $scope.loaders.loading = true;
    return $q
      .all({
        pcc: DedicatedCloud.getSelected($stateParams.productId),
        commercialRanges: DedicatedCloud.isOptionToggable($stateParams.productId, $scope.option, 'disabled', false),
      })
      .then((data) => DedicatedCloud.fetchAllHostsPrices(
        $stateParams.productId,
        data.commercialRanges.oldCommercialVersion,
        data.commercialRanges.newCommercialVersion,
        data.pcc.location,
      ))
      .then((data) => {
        $scope.prices = data.current.map((host, index) => assign(pick(host, ['datacenter', 'name', 'billingType']), {
          current: host.price,
          next: data.next[index].price,
        }));
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_vmware_orderopt_load_prices_error'), err);
        $scope.resetAction();
      })
      .finally(() => {
        $scope.loaders.loading = false;
      });
  };

  $scope.order = function order() {
    $scope.loaders.loading = true;
    DedicatedCloud.enableOption($stateParams.productId, $scope.option)
      .then(() => {
        Alerter.success($translate.instant('dedicatedCloud_vmware_orderopt_activate_success'));
        $rootScope.$broadcast('vmware-option-enable', $scope.option);
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_vmware_orderopt_activate_error'), err);
      })
      .finally(() => {
        $scope.loaders.loading = false;
        $scope.resetAction();
      });
  };
});
