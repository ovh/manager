import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.firewall.rule.delete', {
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
          ? 'app.ip.firewall'
          : null,
      );
    },
    resolve: {
      rule: /* @ngInject */ ($transition$) => $transition$.params().rule,
    },
    views: {
      modal: {
        component: 'ipFirewallRuleDelete',
      },
    },
    layout: 'modal',
  });
};
