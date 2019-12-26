import head from 'lodash/head';

angular
  .module('App')
  .controller(
    'ServerOrderProUseCtrl',
    ($scope, $stateParams, $translate, Server, Alerter, $q, $rootScope) => {
      $scope.loading = {
        durations: false,
        prices: false,
        validation: false,
      };
      $scope.model = {
        nameServer: $scope.currentActionData,
        duration: null,
        agree: false,
      };
      $scope.durations = {
        available: null,
        details: {},
      };

      //= ==============STEP 2===============

      function loadPrices(durations) {
        const queue = [];
        $scope.loading.prices = true;

        angular.forEach(durations, (duration) => {
          queue.push(
            Server.getOrderProUseOrder($stateParams.productId, duration).then(
              (details) => {
                $scope.durations.details[duration] = details;
              },
            ),
          );
        });

        $q.all(queue).then(
          () => {
            $scope.loading.prices = false;
            if (durations && durations.length === 1) {
              $scope.model.duration = head(durations);
            }
          },
          (data) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'server_configuration_profesionnal_use_order_step2_error',
              ),
              data.data,
            );
            $scope.resetAction();
            $scope.loading.durations = false;
          },
        );
      }

      $scope.getDurations = function getDurations() {
        $scope.loading.durations = true;

        Server.getOrderProUseDuration($stateParams.productId).then(
          (durations) => {
            $scope.loading.durations = false;
            $scope.durations.available = durations;
            loadPrices(durations);
          },
        );
      };

      //= ==============STEP 3===============

      $scope.loadContracts = function loadContracts() {
        $scope.model.agree = false;
        if (
          !$scope.durations.details[$scope.model.duration].contracts ||
          !$scope.durations.details[$scope.model.duration].contracts.length
        ) {
          $rootScope.$broadcast('wizard-goToStep', 5);
        }
      };

      $scope.backToContracts = function backToContracts() {
        if (
          !$scope.durations.details[$scope.model.duration].contracts ||
          !$scope.durations.details[$scope.model.duration].contracts.length
        ) {
          $rootScope.$broadcast('wizard-goToStep', 2);
        }
      };

      //= ==============STEP 4===============

      $scope.getResumePrice = function getResumePrice(price) {
        return price.value === 0
          ? $translate.instant('price_free')
          : $translate.instant('price_ht_label', { t0: price.text });
      };

      $scope.orderProUse = function orderProUse() {
        $scope.loading.validation = true;
        Server.orderProUse($stateParams.productId, $scope.model.duration).then(
          (order) => {
            $scope.loading.validation = false;
            Alerter.alertFromSWS(
              $translate.instant(
                'server_configuration_profesionnal_use_order_finish_success',
                {
                  t0: order.url,
                  t1: order.orderId,
                },
              ),
              { idTask: order.orderId, state: 'OK' },
            );
            window.open(order.url, '_blank');
            $scope.resetAction();
          },
          (data) => {
            $scope.loading.validation = false;
            Alerter.alertFromSWS(
              $translate.instant(
                'server_configuration_profesionnal_use_order_finish_error',
              ),
              data.data,
            );
          },
        );
      };
    },
  );
