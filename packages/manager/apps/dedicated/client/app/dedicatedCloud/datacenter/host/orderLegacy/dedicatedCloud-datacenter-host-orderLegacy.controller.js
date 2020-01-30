angular
  .module('App')
  .controller(
    'DedicatedCloudDatacentersOrderHostsLegacyCtrl',
    ($scope, $stateParams, DedicatedCloud, $translate) => {
      $scope.orderHosts = {
        datacenter: null,
        model: null,
        selected: null,
        selectedModel: null,
        quantityToOrder: 1,
        orderResult: null,
        agreeContract: null,
        loading: false,
      };
      $scope.dedicatedCloud = null;

      $scope.loadHostsProfiles = function loadHostsProfiles() {
        $scope.orderHosts.loading = true;
        $scope.orderHosts.datacenter = $scope.currentActionData;

        DedicatedCloud.getSelected($stateParams.productId, false)
          .then(
            (dedicatedCloud) => {
              $scope.dedicatedCloud = dedicatedCloud;
              return DedicatedCloud.getOrderableHostsProfiles(
                $stateParams.productId,
                $scope.dedicatedCloud.location,
                $scope.orderHosts.datacenter.id,
              )
                .then((data) => {
                  $scope.orderHosts.model = data;
                })
                .catch((data) => {
                  $scope.resetAction();
                  $scope.setMessage(
                    $translate.instant(
                      'dedicatedCloud_configuration_order_hosts_finish_fail',
                      {
                        t0: $scope.orderHosts.datacenter.name,
                      },
                    ),
                    angular.extend(data, { type: 'ERROR' }),
                  );
                });
            },
            (data) => {
              $scope.setMessage(
                $translate.instant(
                  'dedicatedCloud_configuration_order_hosts_finish_fail',
                ),
                angular.extend(data, { type: 'ERROR' }),
              );
            },
          )
          .finally(() => {
            $scope.orderHosts.loading = false;
          });
      };

      $scope.$watch('orderHosts.quantityToOrder', () => {
        if (
          $scope.orderHosts.quantityToOrder &&
          !Number.isNaN($scope.orderHosts.quantityToOrder)
        ) {
          if ($scope.orderHosts.quantityToOrder < 1) {
            $scope.orderHosts.quantityToOrder = 1;
          } else if ($scope.orderHosts.quantityToOrder > 20) {
            $scope.orderHosts.quantityToOrder = 20;
          }
        } else {
          $scope.orderHosts.quantityToOrder = 1;
        }
      });

      $scope.getHostSelected = function getHostSelected() {
        $scope.orderHosts.loading = true;
        $scope.orderHosts.selectedModel =
          $scope.orderHosts.model[$scope.orderHosts.selected];

        DedicatedCloud.getMonthlyHostOrder(
          $stateParams.productId,
          $scope.orderHosts.datacenter.id,
          $scope.orderHosts.selectedModel.name,
          $scope.orderHosts.quantityToOrder,
        )
          .then((data) => {
            $scope.orderHosts.orderResult = data;
          })
          .catch((data) => {
            $scope.resetAction();
            $scope.setMessage(
              $translate.instant(
                'dedicatedCloud_configuration_order_hosts_finish_fail',
                {
                  t0: $scope.orderHosts.datacenter.name,
                },
              ),
              angular.extend(data, { type: 'ERROR' }),
            );
          })
          .finally(() => {
            $scope.orderHosts.loading = false;
          });
      };

      $scope.displayBC = function displayBC() {
        $scope.orderHosts.loading = true;

        DedicatedCloud.orderHosts(
          $stateParams.productId,
          $scope.orderHosts.datacenter.id,
          $scope.orderHosts.selectedModel.name,
          $scope.orderHosts.quantityToOrder,
        )
          .then((data) => {
            window.open(data.url, '_blank');
            $scope.setMessage(
              $translate.instant(
                'dedicatedCloud_configuration_order_hosts_finish_success',
                {
                  t0: data.url,
                  t1: data.orderId,
                },
              ),
              'true',
            );
          })
          .catch((data) => {
            $scope.setMessage(
              $translate.instant(
                'dedicatedCloud_configuration_order_hosts_finish_fail',
                {
                  t0: $scope.orderHosts.datacenter.name,
                },
              ),
              angular.extend(data, { type: 'ERROR' }),
            );
          })
          .finally(() => {
            $scope.resetAction();
            $scope.orderHosts.loading = false;
          });
      };
    },
  );
