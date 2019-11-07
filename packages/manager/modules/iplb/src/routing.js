import iplbTemplate from './template.html';
import iplbDetailTemplate from './iplb-detail.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('network', {
      url: '/network',
      template: `
                <div data-ui-view="networkContainer"></div>
            `,
      abstract: true,
    })
    .state('network.iplb', {
      url: '/iplb',
      views: {
        networkContainer: {
          template: iplbTemplate,
        },
      },
      translations: {
        value: ['../common', '.'],
        format: 'json',
      },
    })
    .state('network.iplb.detail', {
      url: '/{serviceName}',
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
