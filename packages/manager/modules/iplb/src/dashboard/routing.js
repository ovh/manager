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
    translations: {
      value: ['../cloud', './configuration', '../vrack/modals'],
      format: 'json',
    },
  });
};
