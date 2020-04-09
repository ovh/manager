import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.reverse.delete', {
    url: '/delete',
    params: {
      ipBlock: {
        type: 'string',
      },
      reverse: {
        type: 'string',
      },
      serviceName: {
        type: 'string',
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('ipBlock'),
        transition.injector().getAsync('reverse'),
        transition.injector().getAsync('serviceName'),
      ]).then(([ipBlock, reverse, serviceName]) =>
        isEmpty(ipBlock) || isEmpty(reverse) || isEmpty(serviceName)
          ? 'app.ip.dashboard'
          : null,
      );
    },
    resolve: {
      reverse: /* @ngInject */ ($transition$) => $transition$.params().reverse,
    },
    views: {
      modal: {
        component: 'ipDashboardReverseDelete',
      },
    },
    layout: 'modal',
  });
};
