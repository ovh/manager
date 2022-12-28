import controller from './ip-ip-firewall-game.controler';
import template from './ip-ip-firewall-game.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.ip.game-firewall', {
    url: '/game-firewall',
    template,
    controller,
    controllerAs: 'IpGameFirewallCtrl',
    reloadOnSearch: false,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('ip_firewall_game'),
    },
  });
};
