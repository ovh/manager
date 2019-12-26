import set from 'lodash/set';

angular
  .module('App')
  .controller(
    'KvmOrderCtrl',
    ($scope, $rootScope, $stateParams, $translate, Server, Alerter) => {
      $scope.user = $scope.currentActionData;
      $scope.order = {};

      $scope.loaders = {
        details: false,
        validation: false,
      };

      /*= =============================
=            STEP 1            =
============================== */
      $scope.loadOptionDetails = function loadOptionDetails() {
        $scope.loaders.details = true;
        Server.getKvmOrderDurations($stateParams.productId)
          .then(
            (durations) => {
              Server.getKvmOrderDetails($stateParams.productId, durations).then(
                (orderDetails) => {
                  $scope.order.details = orderDetails.map((detail, i) => {
                    set(detail, 'duration', durations[i]);
                    return detail;
                  });
                },
                (err) => {
                  Alerter.alertFromSWS(
                    $translate.instant('server_configuration_kvm_order_error'),
                    err.data,
                  );
                  $scope.resetAction();
                },
              );
            },
            (err) => {
              Alerter.alertFromSWS(
                $translate.instant('server_configuration_kvm_order_error'),
                err.data,
              );
              $scope.resetAction();
            },
          )
          .finally(() => {
            $scope.loaders.details = false;
          });
      };

      /*= =============================
    =            STEP 2           =
============================== */
      $scope.loadDetail = function loadDetail() {
        $scope.orderDetail =
          $scope.order.details.filter(
            (detail) => detail.duration === $scope.order.durationSelected,
          )[0] || {};
      };

      $scope.confirmOrder = function confirmOrder() {
        $scope.loaders.validation = true;
        Server.postKvmOrderInfos(
          $stateParams.productId,
          $scope.order.durationSelected,
        )
          .then(
            (data) => {
              Alerter.alertFromSWS(
                $translate.instant(
                  'server_configuration_kvm_order_finish_success',
                  {
                    t0: data.url,
                    t1: data.orderId,
                  },
                ),
                { idTask: data.orderId, state: 'OK' },
                'server_tab_ipmi_alert',
              );
              window.open(data.url, '_blank');
            },
            (err) => {
              Alerter.alertFromSWS(
                $translate.instant('server_configuration_kvm_order_error'),
                err.data,
              );
            },
          )
          .finally(() => {
            $scope.loaders.validation = false;
            $scope.resetAction();
          });
      };
    },
  );
