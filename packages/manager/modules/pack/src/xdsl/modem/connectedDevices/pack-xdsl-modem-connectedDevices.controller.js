angular.module('managerApp').controller('XdslModemConnectedDevicesCtrl', function ($scope, $stateParams, $q, $translate, OvhApiXdsl, TucToast, TucPackXdslModemMediator) {
  const self = this;
  self.devices = [];

  /**
     * Get the tooltip and the icon for the device based on the hostname
     * @param {object} device Device description
     * @returns {string|null}
     */
  self.getDeviceInfo = function (device) {
    switch (true) {
      case (/android/i).test(device.hostName):
        return {
          tooltip: 'Android',
          icon: 'fa-android',
        };
      case (/win/i).test(device.hostName):
        return {
          tooltip: 'Windows',
          icon: 'fa-windows',
        };
      case (/apple/i).test(device.hostName):
      case (/mac/i).test(device.hostName):
      case (/ios/i).test(device.hostName):
      case (/ipad/i).test(device.hostName):
      case (/ipod/i).test(device.hostName):
      case (/iphone/i).test(device.hostName):
      case (/iwatch/i).test(device.hostName):
        return {
          tooltip: 'Apple',
          icon: 'fa-apple',
        };
      default:
        return {
          tooltip: 'xdsl_modem_device_other',
          icon: '',
        };
    }
  };

  /**
     * Get the icon of the connection (wifi or ethernet)
     * @param {object} device Device description
     * @returns {string}
     */
  self.getConnectionIcon = function (device) {
    if (device.interfaceType.match(/ethernet/i)) {
      return 'ovh-font-telecom-ethernet';
    }
    return 'ovh-font-wifi';
  };

  /**
     * Get All connected devices
     */
  self.getConnectedDevices = function () {
    return OvhApiXdsl.Modem().ConnectedDevices().Aapi().query({
      xdslId: $stateParams.serviceName,
    }).$promise.then((data) => {
      self.devices = data;
      return data;
    }).catch((err) => {
      TucToast.error($translate.instant('xdsl_modem_connected_list_error'));
      return $q.reject(err);
    });
  };

  /**
     * Launch the refresh of the connected devices
     */
  self.refresh = function () {
    this.devices = null;
    this.loading = true;
    TucPackXdslModemMediator.disableCapabilities();
    return OvhApiXdsl.Modem().ConnectedDevices().Aapi().refresh({
      xdslId: $stateParams.serviceName,
    }).$promise.then((data) => {
      self.devices = data;
      return data;
    }).catch((err) => {
      TucToast.error($translate.instant('xdsl_modem_refresh_error'));
      return $q.reject(err);
    }).finally(() => {
      self.loading = false;
    });
  };

  /**
     * Controller initialization
     */
  self.$onInit = function () {
    self.devices = null;
    self.refreshWatcher = angular.noop;
    self.getConnectedDevices();

    $scope.$on('pack_xdsl_modem_task_refreshConnectedDevices', (event, state) => {
      self.loading = state;
      if (!state) {
        self.getConnectedDevices().finally(() => {
          self.loading = false;
        });
      }
    });
  };
});
