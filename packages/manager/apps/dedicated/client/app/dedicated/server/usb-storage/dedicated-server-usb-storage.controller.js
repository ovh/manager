angular
  .module('App')
  .controller(
    'UsbStorageCtrl',
    ($scope, $stateParams, $translate, Server, Alerter) => {
      $scope.loading = true;
      $scope.usbInformations = {
        numberOfFreeSlot: 0,
        usbKeys: [],
        orderable: false,
        capacities: [],
      };

      const init = function init() {
        Server.getUsbStorageInformations($stateParams.productId).then(
          (result) => {
            $scope.usbInformations.numberOfFreeSlot = new Array(
              result[0].number,
            );
            $scope.usbInformations.usbKeys = result[1].usbKeys;
            $scope.usbInformations.capacities = result[0].capacity;

            $scope.loading = false;
          },
          (error) => {
            $scope.loading = false;
            Alerter.alertFromSWS(
              $translate.instant('server_tab_USB_STORAGE_loading_error'),
              error.data,
              'loadingError',
            );
          },
        );
      };

      init();
    },
  );
