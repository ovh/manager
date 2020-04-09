import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.reverse.add', {
    url: '/add',
    params: {
      ipBlock: {
        type: 'string',
      },
      serviceName: {
        type: 'string',
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('ipBlock'),
        transition.injector().getAsync('serviceName'),
      ]).then(([ipBlock, serviceName]) =>
        isEmpty(ipBlock) || isEmpty(serviceName) ? 'app.ip.dashboard' : null,
      );
    },
    views: {
      modal: {
        component: 'ipDashboardReverseAdd',
      },
    },
    layout: 'modal',
  });
};
