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
          OctaviaLoadBalancerOverviewService,
          projectId,
          region,
          loadbalancer,
        ) =>
          OctaviaLoadBalancerOverviewService.getFlavor(
            projectId,
            region,
            loadbalancer.flavorId,
          ),
        network: /* @ngInject */ (
          OctaviaLoadBalancerOverviewService,
          projectId,
          region,
          loadbalancer,
        ) =>
          OctaviaLoadBalancerOverviewService.getPrivateNetwork(
            projectId,
            region,
            loadbalancer.vipNetworkId,
          ),
        subnet: /* @ngInject */ (
          OctaviaLoadBalancerOverviewService,
          projectId,
          region,
          loadbalancer,
        ) =>
          OctaviaLoadBalancerOverviewService.getSubnet(
            projectId,
            region,
            loadbalancer.vipNetworkId,
            loadbalancer.vipSubnetId,
          ),
        openEditNameModal: /* @ngInject */ ($state) => () => {
          $state.go(
            'octavia-load-balancer.loadbalancer.general-information.edit-name',
          );
        },
      },
      atInternet: {
        rename: `${TRACKING_NAME}`,
      },
    },
  );
};
