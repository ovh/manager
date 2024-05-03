import { TRACKING_CHAPTER_1, TRACKING_NAME, DISCOVER_LINK } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer', {
    url: '/:region/:loadbalancerId',
    views: {
      octaviaLoadBalancerView: 'octaviaLoadBalancer',
    },
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      region: /* @ngInject */ ($transition$) => $transition$.params().region,
      loadbalancerId: /* @ngInject */ ($transition$) =>
        $transition$.params().loadbalancerId,
      loadbalancer: /* @ngInject */ (
        OctaviaLoadBalancerService,
        projectId,
        region,
        loadbalancerId,
      ) =>
        OctaviaLoadBalancerService.getLoadbalancer(
          projectId,
          region,
          loadbalancerId,
        ),
      breadcrumb: /* @ngInject */ (loadbalancerId) => loadbalancerId,
      generalInformationLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
      ) =>
        $state.href('octavia-load-balancer.loadbalancer.general-information', {
          projectId,
          region,
          loadbalancerId,
        }),
      listenersLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
      ) =>
        $state.href('octavia-load-balancer.loadbalancer.listeners', {
          projectId,
          region,
          loadbalancerId,
        }),
      poolsLink: /* @ngInject */ ($state, projectId, region, loadbalancerId) =>
        $state.href('octavia-load-balancer.loadbalancer.pools', {
          projectId,
          region,
          loadbalancerId,
        }),
      statisticsLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
      ) =>
        $state.href('octavia-load-balancer.loadbalancer.statistics', {
          projectId,
          region,
          loadbalancerId,
        }),
      certificatesLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
      ) =>
        $state.href('octavia-load-balancer.loadbalancer.certificates', {
          projectId,
          region,
          loadbalancerId,
        }),
      logsLink: /* @ngInject */ ($state, projectId, region, loadbalancerId) =>
        $state.href('octavia-load-balancer.loadbalancer.logs', {
          projectId,
          region,
          loadbalancerId,
        }),
      discoverLink: () => DISCOVER_LINK,
      trackRoot: () => `${TRACKING_CHAPTER_1}::${TRACKING_NAME}`,
    },
    atInternet: {
      ignore: true,
    },
    redirectTo: 'octavia-load-balancer.loadbalancer.general-information',
  });
};
