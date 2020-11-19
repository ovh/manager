angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.packs.pack.xdsl.line.modem.dmz', {
      url: '/dmz',
      views: {
        'modemView@telecom.packs.pack.xdsl.line.modem': {
          templateUrl:
            'app/telecom/pack/xdsl/modem/dmz/pack-xdsl-modem-dmz.html',
          controller: 'XdslModemDmzCtrl',
          controllerAs: 'DmzCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('xdsl_modem_dmz_status'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
