import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.firewall-game.rule.delete', {
    url: '/delete',
    params: {
      ip: {
        type: 'string',
      },
      ipBlock: {
        type: 'string',
      },
      rule: {
        type: 'json',
        value: null,
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('ip'),
        transition.injector().getAsync('ipBlock'),
        transition.injector().getAsync('rule'),
      ]).then(([ip, ipBlock, rule]) =>
        isEmpty(ip) || isEmpty(ipBlock) || isEmpty(rule)
          ? 'app.ip.firewall-game'
          : null,
      );
    },
    resolve: {
      rule: /* @ngInject */ ($transition$) => $transition$.params().rule,
    },
    views: {
      modal: {
        component: 'ipFirewallGameRuleDelete',
      },
    },
    layout: 'modal',
  });
};
