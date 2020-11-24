import head from 'lodash/head';

angular
  .module('App')
  .controller(
    'UsbStorageOrderCtrl',
    (
      $rootScope,
      $scope,
      $q,
      $stateParams,
      $translate,
      Server,
      ducUser,
      Alerter,
    ) => {
      ducUser.getUser().then((user) => {
        $scope.ovhSubsidiary = user.ovhSubsidiary;
      });

      $scope.model = {
        capacity: null,
        duration: null,
      };
      $scope.loading = {
        durations: null,
      };

      $scope.agree = {
        value: false,
      };

      /*= =============================
  =            STEP 1            =
  ============================== */

      $scope.informations = $scope.currentActionData;

      /*= =============================
  =            STEP 2            =
  ============================== */

      function loadPrices(durations) {
        const queue = [];
        $scope.loading.prices = true;

        angular.forEach(durations, (duration) => {
          queue.push(
            Server.getUsbStorageOrder(
              $stateParams.productId,
              $scope.model.capacity,
              duration,
            ).then((details) => {
              $scope.durations.details[duration] = details;
            }),
          );
        });

        $q.all(queue).then(
          () => {
            if (durations && durations.length === 1) {
              $scope.model.duration = head(durations);
            }
            $scope.loading.prices = false;
          },
          (data) => {
            Alerter.alertFromSWS(
              $translate.instant('server_tab_USB_STORAGE_order_loading_error'),
              data.data,
            );
            $scope.loading.durations = false;
          },
        );
      }

      $scope.getDurations = function getDurations() {
        $scope.durations = {
          available: null,
          details: {},
        };
        $scope.loading.durations = true;

        Server.getUsbStorageDurations(
          $stateParams.productId,
          $scope.model.capacity,
        ).then((durations) => {
          $scope.loading.durations = false;
          $scope.durations.available = durations;
          loadPrices(durations);
        });
      };

      /*= =============================
  =            STEP 3            =
  ============================== */

      $scope.loadContracts = function loadContracts() {
        $scope.agree.value = false;
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

      /*= =============================
        =            STEP 4            =
        ============================== */

      $scope.getResumePrice = function getResumePrice(price) {
        return price.value === 0
          ? $translate.instant('price_free')
          : $translate.instant('price_ht_label', { price: price.text });
      };

      $scope.orderUsbDisk = function orderUsbDisk() {
        $scope.loading.validation = true;
        Server.orderUsbStorage(
          $stateParams.productId,
          $scope.model.capacity,
          $scope.model.duration,
        )
          .then((order) => {
            $scope.loading.validation = false;
            Alerter.alertFromSWS(
              $translate.instant(
                'server_tab_USB_STORAGE_order_finish_success',
                {
                  t0: order.url,
                  t1: order.orderId,
                },
              ),
              { idTask: order.orderId, state: 'OK' },
            );
            window.open(order.url, '_blank');
            $scope.resetAction();
          })
          .catch((data) => {
            $scope.loading.validation = false;
            Alerter.alertFromSWS(
              $translate.instant('server_tab_USB_STORAGE_order_finish_error'),
              data.data,
            );
          });
      };
    },
  );
