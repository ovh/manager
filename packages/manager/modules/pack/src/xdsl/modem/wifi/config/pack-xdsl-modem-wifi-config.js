angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.xdsl.modem.wifi', {
    url: '/wifi',
    views: {
      'modemView@telecom.pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/wifi/config/pack-xdsl-modem-wifi-config.html',
        controller: 'XdslModemWifiConfigCtrl',
        controllerAs: 'ConfigWifiCtrl',
      },
    },
    translations: ['.'],
    params: {
      wifi: null,
    },
  });
});
