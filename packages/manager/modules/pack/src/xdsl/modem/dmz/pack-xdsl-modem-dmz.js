angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('pack.xdsl.modem.dmz', {
    url: '/dmz',
    views: {
      'modemView@pack.xdsl.modem': {
        templateUrl: 'app/telecom/pack/xdsl/modem/dmz/pack-xdsl-modem-dmz.html',
        controller: 'XdslModemDmzCtrl',
        controllerAs: 'DmzCtrl',
      },
    },
    translations: ['.'],
  });
});
