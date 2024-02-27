import {
  TRACKING_CHAPTER_1,
  TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX,
} from '../octavia-load-balancer.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancers', {
    url: '/load-balancers',
    views: {
      octaviaLoadBalancerView: 'octaviaLoadBalancerListing',
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length === 0 ? 'octavia-load-balancer.onboarding' : false,
        ),
    resolve: {
      breadcrumb: () => null,
      goToCreatePage: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: `${TRACKING_CHAPTER_1}::${TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX}::add`,
          type: 'action',
        });
        $state.go('octavia-load-balancer.create');
      },
      dashboardPageLink: /* @ngInject */ ($state) => ({ id, region }) =>
        $state.href('octavia-load-balancer.loadbalancer', {
          region,
          loadbalancerId: id,
        }),
      dashboardPageTracking: () =>
        `${TRACKING_CHAPTER_1}::${TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX}::detail`,
      goToDashboardPage: /* @ngInject */ (
        $state,
        atInternet,
        dashboardPageTracking,
      ) => ({ id, region }) => {
        atInternet.trackClick({
          name: dashboardPageTracking,
          type: 'action',
        });
        $state.go('octavia-load-balancer.loadbalancer', {
          region,
          loadbalancerId: id,
        });
      },
      goToDeleteLoadBalancer: /* @ngInject */ ($state, atInternet) => ({
        id,
        name,
        region,
      }) => {
        atInternet.trackClick({
          name: `${TRACKING_CHAPTER_1}::${TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX}::delete`,
          type: 'action',
        });
        $state.go('octavia-load-balancer.loadbalancers.delete', {
          loadBalancerId: id,
          loadBalancerName: name,
          loadBalancerRegion: region,
        });
      },
      resources: /* @ngInject */ ($http, projectId) =>
        $http
          .get(`/cloud/project/${projectId}/aggregated/loadbalancer`)
          .then(({ data }) => data.resources),
    },
    atInternet: {
      rename: TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX,
    },
  });
};
