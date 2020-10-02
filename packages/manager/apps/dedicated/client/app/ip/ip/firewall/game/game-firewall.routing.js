import template from './ip-ip-firewall-game.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.ip.game-firewall', {
    url: '/game-firewall',
    template,
    controller: 'IpGameFirewallCtrl',
    controllerAs: 'IpGameFirewallCtrl',
    reloadOnSearch: false,
  });
};
