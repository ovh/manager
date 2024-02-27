import { TRACKING_NAME } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.onboarding', {
    url: '/onboarding',
    views: {
      octaviaLoadBalancerView: 'octaviaLoadBalancerOnboarding',
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? 'octavia-load-balancer.loadbalancers' : false,
        ),
    resolve: {
      breadcrumb: () => null,
      resources: /* @ngInject */ ($http, projectId) =>
        $http
          .get(`/cloud/project/${projectId}/aggregated/loadbalancer`)
          .then(({ data }) => data.resources),
      hasPrivateNetwork: /* @ngInject */ ($http, projectId) =>
        $http
          .get(`/cloud/project/${projectId}/network/private`)
          .then(({ data }) => data && data.length > 0),
      goToLoadBalancerCreation: /* @ngInject */ ($state) => () =>
        $state.go('octavia-load-balancer.create'),
      goToNoPrivateNetwork: /* @ngInject */ ($state) => () =>
        $state.go('octavia-load-balancer.onboarding.no-private-network'),
    },
    atInternet: {
      rename: TRACKING_NAME,
    },
  });
};
