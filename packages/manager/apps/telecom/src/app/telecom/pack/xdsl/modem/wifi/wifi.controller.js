import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function XdslModemWifiCtrl(
  $stateParams,
  $translate,
  $q,
  OvhApiXdsl,
  TucToast,
  TucPackXdslModemMediator,
) {
  const self = this;
  this.loader = true;
  this.mediator = TucPackXdslModemMediator;

  self.wifis = null;
  self.defaultWifi = null;

  this.undo = function undo() {
    self.defaultWifi.enabled = self.undoData.enabled;
  };

  this.update = function update() {
    if (
      isEmpty($stateParams.serviceName) ||
      !TucPackXdslModemMediator.capabilities.canChangeWLAN
    ) {
      TucToast.error(
        $translate.instant('xdsl_modem_firewall_an_error_ocurred'),
      );
      return $q.reject();
    }
    this.loader = true;
    return OvhApiXdsl.Modem()
      .Wifi()
      .v6()
      .update(
        {
          xdslId: $stateParams.serviceName,
          wifiName: self.defaultWifi.wifiName,
        },
        {
          enabled: self.defaultWifi.enabled,
        },
      )
      .$promise.then((data) => {
        TucPackXdslModemMediator.setTask('changeModemConfigWLAN');
        TucToast.success(
          $translate.instant(
            self.defaultWifi.enabled
              ? 'xdsl_modem_wifi_success_validation_on'
              : 'xdsl_modem_wifi_success_validation_off',
          ),
        );
        self.undoData.enabled = self.defaultWifi.enabled;
        return data;
      })
      .catch((err) => {
        self.defaultWifi.enabled = self.undoData.enabled;
        TucToast.error($translate.instant('xdsl_modem_wifi_update_error'));
        return $q.reject(err);
      })
      .finally(() => {
        self.loader = false;
      });
  };

  function initModemWifi() {
    self.loader = true;
    return OvhApiXdsl.Modem()
      .Wifi()
      .Aapi()
      .getWifiDetails({
        xdslId: $stateParams.serviceName,
      })
      .$promise.then((data) => {
        self.wifis = data;

        self.defaultWifi = find(self.wifis, {
          wifiName: 'defaultWIFI',
        });
        self.undoData = {
          enabled: self.defaultWifi ? self.defaultWifi.enabled : false,
        };
        return data;
      })
      .catch((err) => {
        TucToast.error($translate.instant('xdsl_modem_wifi_read_error'));
        return $q.reject(err);
      })
      .finally(() => {
        self.loader = false;
      });
  }

  initModemWifi();
}
