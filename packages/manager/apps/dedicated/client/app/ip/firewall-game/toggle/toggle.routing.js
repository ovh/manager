import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.firewall-game.toggle', {
    url: '/toggle',
    params: {
      firewall: {
        type: 'json',
        value: null,
      },
      ip: {
        type: 'string',
      },
      ipBlock: {
        type: 'string',
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('firewall'),
        transition.injector().getAsync('ip'),
        transition.injector().getAsync('ipBlock'),
      ]).then(([firewall, ip, ipBlock]) =>
        isEmpty(firewall) || isEmpty(ip) || isEmpty(ipBlock)
          ? 'app.ip.firewall-game'
          : null,
      );
    },
    resolve: {
      firewall: /* @ngInject */ ($transition$) =>
        $transition$.params().firewall,
      goBack: /* @ngInject */ (goToFirewallGame) => goToFirewallGame,
      ip: /* @ngInject */ ($transition$) => $transition$.params().ip,
      ipBlock: /* @ngInject */ ($transition$) => $transition$.params().ipBlock,
    },
    views: {
      modal: {
        component: 'ipFirewallGameToggle',
      },
    },
    layout: 'modal',
  });
};
