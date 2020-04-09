import find from 'lodash/find';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.firewall-game', {
    url: '/firewall-game?ip&ipBlock&serviceName',
    params: {
      ip: {
        type: 'string',
      },
      ipBlock: {
        type: 'string',
      },
      serviceName: {
        type: 'string',
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('ip'),
        transition.injector().getAsync('ipBlock'),
        transition.injector().getAsync('serviceName'),
      ]).then(([ip, ipBlock, serviceName]) =>
        isEmpty(ip) || isEmpty(ipBlock) || isEmpty(serviceName)
          ? 'app.ip.dashboard'
          : null,
      );
    },
    resolve: {
      goToDashboard: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard', params, transitionParams),
      goToFirewallGame: /* @ngInject */ ($state, Alerter) => (
        params = {},
        transitionParams,
      ) => {
        const promise = $state.go(
          'app.ip.firewall-game',
          params,
          transitionParams,
        );

        const { message } = params;
        if (message) {
          // Alerter.alertFromSWS expects either data.message, data.messages or a String
          let typeToUse;

          if (isString(message.data)) {
            typeToUse = message.data;
          } else if (
            has(message.data, 'message') ||
            has(message.data, 'messages')
          ) {
            typeToUse = message.data;
          } else {
            typeToUse = message.data.type;
          }

          promise.then(() => {
            Alerter.alertFromSWS(
              message.text,
              typeToUse,
              message.id || 'app.ip',
            );
          });
        }

        return promise;
      },
      goToRuleAdd: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.firewall-game.rule.add', params, transitionParams),
      goToRuleDelete: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.firewall-game.rule.delete', params, transitionParams),
      goToToggle: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.firewall-game.toggle', params, transitionParams),
      ip: /* @ngInject */ ($transition$, ipBlock) => {
        const { ip } = $transition$.params();

        return find(ipBlock.ips, { ip });
      },
      ipBlock: /* @ngInject */ ($transition$, Ip, serviceName) => {
        const { ipBlock } = $transition$.params();

        return Ip.getIpsListForService(serviceName).then((ips) => {
          return find(ips, { ipBlock });
        });
      },
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
    views: {
      ip: 'ipFirewallGame',
    },
  });
};
