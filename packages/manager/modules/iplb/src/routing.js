import iplbDetailTemplate from './iplb-detail.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail', {
    url: '/{serviceName}',
    redirectTo: 'network.iplb.detail.home',
    views: {
      iplbContainer: {
        template: iplbDetailTemplate,
        controller: 'IpLoadBalancerDetailCtrl',
        controllerAs: 'ctrl',
      },
    },
    translations: {
      value: ['../cloud', './configuration', '../vrack/modals'],
      format: 'json',
    },
  });
};
