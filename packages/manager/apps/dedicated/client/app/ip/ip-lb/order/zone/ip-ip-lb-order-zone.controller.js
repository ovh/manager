import difference from 'lodash/difference';
import without from 'lodash/without';

angular
  .module('Module.ip.controllers')
  .controller(
    'IplbOrderPopCtrl',
    ($scope, $rootScope, $q, $translate, Ip, Iplb, Alerter, coreConfig) => {
      $scope.data = $scope.currentActionData; // service
      $scope.availablePop = [];
      $scope.model = {};
      $scope.agree = {};
      $scope.order = {};

      $scope.loading = {
        init: true,
      };

      const queue = [];
      queue.push(
        Iplb.isOptionOrderable($scope.data.value, 'pop').then((isOrderable) => {
          $scope.isOrderable = !!isOrderable;
        }),
      );
      queue.push(
        Ip.getIpModels().then((models) => {
          $scope.availablePop = difference(
            models['ip.LoadBalancingZoneEnum'].enum,
            $scope.data.infos.zone || [],
          );

          // Remove trans-ocean pop... :'(
          if (coreConfig.getRegion() === 'EU') {
            $scope.availablePop = without($scope.availablePop, 'bhs');
          } else {
            $scope.availablePop = without(
              $scope.availablePop,
              'gra',
              'rbx',
              'sbg',
            );
          }
        }),
      );
      $q.all(queue).finally(() => {
        $scope.loading.init = false;
      });

      $scope.backToContracts = function backToContracts() {
        if (!$scope.order.contracts || !$scope.order.contracts.length) {
          $rootScope.$broadcast('wizard-goToStep', 1);
        }
      };

      $scope.getResumePrice = function getResumePrice(price) {
        return price.value === 0
          ? $translate.instant('price_free')
          : $translate.instant('price_ht_label', { t0: price.text });
      };

      $scope.getOrder = function getOrder() {
        $scope.agree.value = false;
        $scope.loading.contracts = true;
        Iplb.getOrderPop($scope.data.value, $scope.model.pop).then(
          (order) => {
            $scope.order = order;
            if (!$scope.order.contracts || !$scope.order.contracts.length) {
              $rootScope.$broadcast('wizard-goToStep', 4);
            }
            $scope.loading.contracts = false;
          },
          (data) => {
            Alerter.alertFromSWS(
              $translate.instant('iplb_pop_order_failure'),
              data,
            );
            $scope.resetAction();
          },
        );
      };

      $scope.confirmOrder = function confirmOrder() {
        $scope.loading.validation = true;
        Iplb.postOrderPop($scope.data.value, $scope.model.pop)
          .then(
            (order) => {
              Alerter.success(
                $translate.instant('iplb_pop_order_success', {
                  t0: order.url,
                  t1: order.orderId,
                }),
              );
              window.open(order.url, '_blank');
            },
            (data) => {
              Alerter.alertFromSWS(
                $translate.instant('iplb_pop_order_failure'),
                data,
              );
            },
          )
          .finally(() => {
            $scope.resetAction();
          });
      };
    },
  );
