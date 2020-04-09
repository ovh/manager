import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.antispam.detail', {
    url: '/detail?block&timestamp',
    params: {
      block: {
        type: 'string',
      },
      ip: {
        type: 'string',
      },
      timestamp: {
        type: 'string',
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('block'),
        transition.injector().getAsync('ip'),
        transition.injector().getAsync('timestamp'),
      ]).then(([block, ip, timestamp]) =>
        isEmpty(block) || isEmpty(ip) || isEmpty(timestamp)
          ? 'app.ip.antispam'
          : null,
      );
    },
    resolve: {
      block: /* @ngInject */ ($transition$) => $transition$.params().block,
      goBack: /* @ngInject */ (goToAntispam) => goToAntispam,
      ip: /* @ngInject */ ($transition$) => $transition$.params().ip,
      timestamp: /* @ngInject */ ($transition$) =>
        $transition$.params().timestamp,
    },
    views: {
      modal: {
        component: 'ipAntispamDetail',
      },
    },
    layout: 'modal',
  });
};
