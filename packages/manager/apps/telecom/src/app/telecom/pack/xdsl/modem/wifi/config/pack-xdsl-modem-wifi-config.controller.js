import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import set from 'lodash/set';
import some from 'lodash/some';

angular
  .module('managerApp')
  .controller('XdslModemWifiConfigCtrl', function XdslModemWifiConfigCtrl(
    $state,
    $q,
    $timeout,
    $stateParams,
    $translate,
    TucToast,
    OvhApiXdsl,
    TucPackXdslModemMediator,
    OvhApiXdslModemAvailableWLANChannel,
  ) {
    const self = this;
    self.mediator = TucPackXdslModemMediator;
    self.wifi = null;
    self.modem = null;

    self.errors = {
      wifi: false,
    };

    self.fields = {
      securityType: {},
    };

    const wifiFields = [
      'SSID',
      'SSIDAdvertisementEnabled',
      'channel',
      'channelMode',
      'enabled',
      'securityKey',
      'securityType',
    ];

    self.resetKey = function resetKey() {
      this.wifi.key = '';
      this.wifi.key2 = '';
    };

    self.update = function update() {
      if (!this.wifi) {
        return;
      }

      const wifiTmp = {};

      wifiFields.forEach((field) => {
        if (self.hasConfigFieldChanged(field)) {
          set(wifiTmp, field, get(self.wifi, field));
        }
      });

      if (self.wifi.securityType !== 'None' && self.wifi.key) {
        self.wifi.securityKey = self.wifi.key;
        wifiTmp.securityKey = self.wifi.securityKey;
      }

      OvhApiXdsl.Modem()
        .Wifi()
        .v6()
        .update(
          {
            xdslId: $stateParams.serviceName,
            wifiName: this.wifi.wifiName,
          },
          wifiTmp,
        )
        .$promise.then(
          (data) => {
            TucToast.success(
              $translate.instant(
                self.wifis.length > 1
                  ? 'xdsl_modem_wifi_config_success'
                  : 'xdsl_modem_wifi_config_success_single',
              ),
            );

            if (self.wifis.length > 1) {
              self.resetKey();

              // replace wifi in list
              self.wifis.splice(
                findIndex(self.wifis, {
                  wifiName: self.wifi.wifiName,
                }),
                1,
                self.wifi,
              );
              self.wifi = null;
            } else {
              $timeout(() => {
                $state.go('telecom.packs.pack.xdsl.line.modem');
              }, 2000);
            }
            self.mediator.tasks.changeModemConfigWLAN = true;
            return data;
          },
          (err) => {
            TucToast.error(
              [
                $translate.instant('xdsl_modem_wifi_write_error'),
                get(err, 'data.message'),
              ].join(' '),
            );
            return $q.reject(err);
          },
        );
    };

    self.cancelConfig = function cancelConfig() {
      if (self.wifis.length === 1) {
        $state.go('telecom.packs.pack.xdsl.line.modem');
      } else {
        self.wifi = null;
      }
    };

    self.onChannelChange = function onChannelChange() {
      if (this.wifi.channelCustom !== 'Auto') {
        this.wifi.channelMode = 'Manual';
        this.wifi.channel = this.wifi.channelCustom;
      } else {
        this.wifi.channelMode = 'Auto';
      }
    };

    self.hasConfigFieldChanged = function hasConfigFieldChanged(
      field,
      originalWifi,
    ) {
      let original = originalWifi;
      if (!original) {
        original = find(self.wifis, {
          wifiName: self.wifi.wifiName,
        });
      }

      return !isEqual(get(original, field), get(self.wifi, field));
    };

    self.hasConfigChange = function hasConfigChange() {
      const original = find(self.wifis, {
        wifiName: self.wifi.wifiName,
      });

      return some(flatten([wifiFields, ['key', 'key2']]), (field) =>
        self.hasConfigFieldChanged(field, original),
      );
    };

    /**
     *  Used to avoid refresh of name in section header title when editing
     */
    self.getWifiSsid = function getWifiSsid() {
      return find(self.wifis, {
        wifiName: self.wifi.wifiName,
      }).SSID;
    };

    self.setSelectedWifi = function setSelectedWifi(wifi) {
      // Call API to load available channel for selected wifi
      if (!wifi.guest) {
        OvhApiXdslModemAvailableWLANChannel.v6()
          .get({
            xdslId: $stateParams.serviceName,
            frequency: wifi.frequency,
          })
          .$promise.then((channelList) => {
            self.fields.channelMode = flatten(['Auto', channelList]);
          });
      }
      self.wifi = angular.copy(wifi);
    };

    function getModem() {
      return OvhApiXdsl.Modem()
        .v6()
        .get({
          xdslId: $stateParams.serviceName,
        }).$promise;
    }

    function getWifi() {
      return OvhApiXdsl.Modem()
        .Wifi()
        .Aapi()
        .getWifiDetails({
          xdslId: $stateParams.serviceName,
        }).$promise;
    }

    self.$onInit = function $onInit() {
      return $q
        .all({
          modem: getModem(),
          wifi: getWifi(),
        })
        .then(
          (response) => {
            self.modem = response.modem;

            self.wifis = map(response.wifi, (wifi) => {
              set(
                wifi,
                'channelCustom',
                wifi.channelMode === 'Auto' ? 'Auto' : wifi.channel,
              );
              return wifi;
            }).sort((wifiA) => (wifiA.wifiName === 'defaultWIFI' ? -1 : 1));

            if (self.wifis.length === 1) {
              self.setSelectedWifi(
                find(response.wifi, {
                  wifiName: 'defaultWIFI',
                }),
              );
            }

            self.fields.securityType =
              self.modem.model === 'TG799VAC'
                ? ['None', 'WPA2', 'WPAandWPA2']
                : ['None', 'WEP', 'WPA', 'WPA2', 'WPAandWPA2'];
          },
          (err) => {
            TucToast.error($translate.instant('xdsl_modem_wifi_read_error'));
            return $q.reject(err);
          },
        );
    };
  });
