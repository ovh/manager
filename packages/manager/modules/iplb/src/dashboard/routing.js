import iplbDetailTemplate from './iplb-detail.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iplb.detail', {
    url: '/{serviceName}',
    redirectTo: 'iplb.detail.home',
    views: {
      iplbContainer: {
        template: iplbDetailTemplate,
        controller: 'IpLoadBalancerDetailCtrl',
        controllerAs: 'ctrl',
      },
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
    translations: {
      value: ['../cloud', './configuration', '../vrack/modals'],
      format: 'json',
    },
  });
};
