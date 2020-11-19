angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.packs.pack.xdsl.line.modem.wifi', {
      url: '/wifi',
      views: {
        'modemView@telecom.packs.pack.xdsl.line.modem': {
          templateUrl:
            'app/telecom/pack/xdsl/modem/wifi/config/pack-xdsl-modem-wifi-config.html',
          controller: 'XdslModemWifiConfigCtrl',
          controllerAs: 'ConfigWifiCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('xdsl_modem_wifi_config_title'),
      },
      params: {
        wifi: null,
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
