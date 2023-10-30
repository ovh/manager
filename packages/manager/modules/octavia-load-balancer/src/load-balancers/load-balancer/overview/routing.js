import { TRACKING_NAME } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.general-information',
    {
      url: '/general-information',
      views: {
        loadbalancerView: 'octaviaLoadBalancerOverview',
      },
      resolve: {
        breadcrumb: () => null,
        flavor: /* @ngInject */ (
          OctaviaLoadBalancerService,
          projectId,
          region,
          loadbalancer,
        ) =>
          OctaviaLoadBalancerService.getFlavor(
            projectId,
            region,
            loadbalancer.flavorId,
          ),
        network: /* @ngInject */ (
          OctaviaLoadBalancerService,
          projectId,
          region,
          loadbalancer,
        ) =>
          OctaviaLoadBalancerService.getPrivateNetwork(
            projectId,
            region,
            loadbalancer.vipNetworkId,
          ),
        subnet: /* @ngInject */ (
          OctaviaLoadBalancerService,
          projectId,
          region,
          loadbalancer,
        ) =>
          OctaviaLoadBalancerService.getSubnet(
            projectId,
            region,
            loadbalancer.vipNetworkId,
            loadbalancer.vipSubnetId,
          ),
        goToEditName: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.general-information.edit-name',
          ),
      },
      atInternet: {
        rename: `${TRACKING_NAME}`,
      },
    },
  );
};
