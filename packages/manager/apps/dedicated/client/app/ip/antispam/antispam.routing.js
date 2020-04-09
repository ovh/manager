import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.antispam', {
    url: '/antispam?ip&ipSpamming&serviceName',
    params: {
      ip: {
        type: 'string',
      },
      ipSpamming: {
        type: 'string',
      },
      serviceName: {
        type: 'string',
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('ip'),
        transition.injector().getAsync('ipSpamming'),
        transition.injector().getAsync('serviceName'),
      ]).then(([ip, ipSpamming, serviceName]) =>
        isEmpty(ip) || isEmpty(ipSpamming) || isEmpty(serviceName)
          ? 'app.ip.dashboard'
          : null,
      );
    },
    resolve: {
      goToAntispam: /* @ngInject */ ($state, Alerter) => (
        params = {},
        transitionParams,
      ) => {
        const promise = $state.go('app.ip.antispam', params, transitionParams);

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
      goToDashboard: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard', params, transitionParams),
      goToDetail: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.antispam.detail', params, transitionParams),
      ip: /* @ngInject */ ($transition$) => $transition$.params().ip,
      ipSpamming: /* @ngInject */ ($transition$) =>
        $transition$.params().ipSpamming,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
    views: {
      ip: 'ipAntispam',
    },
  });
};
