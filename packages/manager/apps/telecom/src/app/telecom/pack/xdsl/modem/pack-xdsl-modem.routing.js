export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.modem', {
    url: '/modem',
    views: {
      'xdslView@telecom.packs.pack.xdsl.line': 'packXdslModem',
      'bridgeModeView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/bridgeMode/bridgeMode.html',
        controller: 'XdslModemBridgeModeCtrl',
        controllerAs: 'BridgeCtrl',
      },
      'connectedDeviceView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl:
          'app/telecom/pack/xdsl/modem/connectedDevices/connectedDevices.html',
        controller: 'XdslModemConnectedDevicesCtrl',
        controllerAs: 'DeviceCtrl',
      },
      'dmzView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/dmz/dmz.html',
        controller: 'XdslModemDmzCtrl',
        controllerAs: 'DmzCtrl',
      },
      'firewallView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/firewall/firewall.html',
        controller: 'XdslModemFirewallCtrl',
        controllerAs: 'FirewallCtrl',
      },
      'managedByOvhView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl:
          'app/telecom/pack/xdsl/modem/managedByOvh/managedByOvh.html',
        controller: 'XdslModemManagedByCtrl',
        controllerAs: 'ManagedByCtrl',
      },
      'mtuView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/mtu/mtu.html',
        controller: 'XdslModemMtuCtrl',
        controllerAs: 'MtuCtrl',
      },
      'modemRebootView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/reboot/reboot.html',
        controller: 'XdslModemRebootCtrl',
        controllerAs: 'RebootCtrl',
      },
      'modemResetView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/reset/reset.html',
        controller: 'XdslModemResetCtrl',
        controllerAs: 'ResetCtrl',
      },
      'routerView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/router/router.html',
        controller: 'XdslModemRouterCtrl',
        controllerAs: 'RouterCtrl',
      },
      'routerBdhcpView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/router/dhcp/bdhcp/bdhcp.html',
        controller: 'XdslModemDhcpBdhcpCtrl',
        controllerAs: 'BdhcpCtrl',
      },
      'routerDhcpView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/router/dhcp/dhcp.html',
        controller: 'XdslModemDhcpCtrl',
        controllerAs: 'DhcpCtrl',
      },
      'routerLanView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/router/lan/lan.html',
        controller: 'XdslModemLanCtrl',
        controllerAs: 'LanCtrl',
      },
      'routerPortView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/router/ports/ports.html',
        controller: 'XdslModemPortsCtrl',
        controllerAs: 'PortCtrl',
      },
      'wifiView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/wifi/wifi.html',
        controller: 'XdslModemWifiCtrl',
        controllerAs: 'WifiCtrl',
      },
      'firmwareView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/firmware/firmware.html',
        controller: 'XdslModemFirmwareCtrl',
        controllerAs: '$ctrl',
      },
      'serviceView@telecom.packs.pack.xdsl.line.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/service/service.html',
        controller: 'XdslModemServiceCtrl',
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      number: /* @ngInject */ ($transition$) => $transition$.params().number,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('xdsl_modem_breadcrumb'),
    },
    translations: {
      value: [
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
        './templates',
      ],
      format: 'json',
    },
  });
};
