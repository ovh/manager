angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.xdsl.modem', {
    url: '/modem',
    views: {
      'xdslView@telecom.pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/modem/pack-xdsl-modem.html',
        controller: 'XdslModemCtrl',
        controllerAs: 'XdslModem',
      },
      'bridgeModeView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/bridgeMode/pack-xdsl-modem-bridgeMode.html',
        controller: 'XdslModemBridgeModeCtrl',
        controllerAs: 'BridgeCtrl',
      },
      'connectedDeviceView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/connectedDevices/pack-xdsl-modem-connectedDevices.html',
        controller: 'XdslModemConnectedDevicesCtrl',
        controllerAs: 'DeviceCtrl',
      },
      'dmzView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/dmz/pack-xdsl-modem-dmz.html',
        controller: 'XdslModemDmzCtrl',
        controllerAs: 'DmzCtrl',
      },
      'firewallView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/firewall/pack-xdsl-modem-firewall.html',
        controller: 'XdslModemFirewallCtrl',
        controllerAs: 'FirewallCtrl',
      },
      'managedByOvhView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/managedByOvh/pack-xdsl-modem-managedByOvh.html',
        controller: 'XdslModemManagedByCtrl',
        controllerAs: 'ManagedByCtrl',
      },
      'mtuView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/mtu/pack-xdsl-modem-mtu.html',
        controller: 'XdslModemMtuCtrl',
        controllerAs: 'MtuCtrl',
      },
      'modemRebootView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/reboot/pack-xdsl-modem-reboot.html',
        controller: 'XdslModemRebootCtrl',
        controllerAs: 'RebootCtrl',
      },
      'modemResetView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/reset/pack-xdsl-modem-reset.html',
        controller: 'XdslModemResetCtrl',
        controllerAs: 'ResetCtrl',
      },
      'routerView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/router/pack-xdsl-modem-router.html',
        controller: 'XdslModemRouterCtrl',
        controllerAs: 'RouterCtrl',
      },
      'routerBdhcpView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/router/dhcp/bdhcp/pack-xdsl-modem-dhcp-bdhcp.html',
        controller: 'XdslModemDhcpBdhcpCtrl',
        controllerAs: 'BdhcpCtrl',
      },
      'routerDhcpView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/router/dhcp/pack-xdsl-modem-dhcp.html',
        controller: 'XdslModemDhcpCtrl',
        controllerAs: 'DhcpCtrl',
      },
      'routerLanView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/router/lan/pack-xdsl-modem-lan.html',
        controller: 'XdslModemLanCtrl',
        controllerAs: 'LanCtrl',
      },
      'routerPortView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/router/ports/pack-xdsl-modem-ports.html',
        controller: 'XdslModemPortsCtrl',
        controllerAs: 'PortCtrl',
      },
      'wifiView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/wifi/pack-xdsl-modem-wifi.html',
        controller: 'XdslModemWifiCtrl',
        controllerAs: 'WifiCtrl',
      },
      'firmwareView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/firmware/pack-xdsl-modem-firmware.html',
        controller: 'XdslModemFirmwareCtrl',
        controllerAs: '$ctrl',
      },
      'serviceView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/service/pack-xdsl-modem-service.html',
        controller: 'XdslModemServiceCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: [
      '.',
      './connectedDevices',
      './bridgeMode',
      './dmz',
      './firewall',
      './managedByOvh',
      './mtu',
      './reboot',
      './reset',
      './router/dhcp',
      './router/dhcp/bdhcp',
      './router/lan',
      './router/ports',
      './wifi',
      './firmware',
      './service',
    ],
  });
});
