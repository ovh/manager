import controller from './ip-ip-firewall-game.controller';
import template from './ip-ip-firewall-game.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.ip.game-firewall', {
    url: '/game-firewall',
    views: {
      'ipview@app.ip': {
        template,
        controller,
        controllerAs: 'IpGameFirewallCtrl',
      },
    },
    reloadOnSearch: false,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('ip_game_mitigation_title'),
      getIp: /* @ngInject */ ($state) => () => $state.params.ip,
      ipGameProtocol: /* @ngInject */ (ip, IpGameFirewall) =>
        IpGameFirewall.getIpdBlock(ip).then((data) => {
          const [ipBlock] = data;
          return IpGameFirewall.getIpGameProtocols(ipBlock, ip);
        }),
    },
  });
};
