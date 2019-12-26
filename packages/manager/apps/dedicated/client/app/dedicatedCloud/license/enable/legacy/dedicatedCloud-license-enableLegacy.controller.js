angular
  .module('App')
  .controller(
    'DedicatedCloudLicencesSplaEnableLegacyCtrl',
    ($scope, $stateParams, $translate, DedicatedCloud, $rootScope) => {
      $scope.spla = {
        agreeContract: false,
        model: null,
        loading: false,
      };

      $scope.loadActiveSpla = function loadActiveSpla() {
        $scope.spla.loading = true;
        DedicatedCloud.getSplaOrder($stateParams.productId).then(
          (order) => {
            $scope.spla.model = order;
            $scope.spla.loading = false;
          },
          (data) => {
            $scope.spla.loading = false;
            $scope.resetAction();
            $scope.setMessage(
              $translate.instant(
                'dedicatedCloud_tab_licences_active_spla_load_fail',
              ),
              angular.extend(data, { type: 'ERROR' }),
            );
          },
        );
      };

      $scope.enableSpla = function enableSpla() {
        $scope.spla.loading = true;
        DedicatedCloud.postSplaOrder($stateParams.productId).then(
          (data) => {
            $scope.spla.loading = false;
            $scope.resetAction();
            window.open(data.url, '_blank');
            $scope.setMessage(
              $translate.instant(
                'dedicatedCloud_tab_licences_active_spla_success',
                {
                  t0: data.url,
                  t1: data.orderId,
                },
              ),
              true,
            );
          },
          (data) => {
            $scope.spla.loading = false;
            $scope.resetAction();
            $rootScope.$broadcast('datacenter.veeam.reload');
            $scope.setMessage(
              $translate.instant(
                'dedicatedCloud_tab_licences_active_spla_fail',
              ),
              angular.extend(data, { type: 'ERROR' }),
            );
          },
        );
      };
    },
  );
