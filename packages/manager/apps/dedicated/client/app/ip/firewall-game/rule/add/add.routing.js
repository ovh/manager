import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.firewall-game.rule.add', {
    url: '/add',
    params: {
      ip: {
        type: 'string',
      },
      ipBlock: {
        type: 'string',
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('ip'),
        transition.injector().getAsync('ipBlock'),
      ]).then(([ip, ipBlock]) =>
        isEmpty(ip) || isEmpty(ipBlock) ? 'app.ip.firewall-game' : null,
      );
    },
    views: {
      modal: {
        component: 'ipFirewallGameRuleAdd',
      },
    },
    layout: 'modal',
  });
};
