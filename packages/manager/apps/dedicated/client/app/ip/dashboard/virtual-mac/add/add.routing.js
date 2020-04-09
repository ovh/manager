import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.virtual-mac.add', {
    url: '/add',
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
      serviceType: {
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
    views: {
      modal: {
        component: 'ipDashboardVirtualMacAdd',
      },
    },
    layout: 'modal',
  });
};
