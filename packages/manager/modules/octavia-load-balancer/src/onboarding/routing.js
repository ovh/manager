import { TRACKING_NAME } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.onboarding', {
    url: '/onboarding',
    component: 'octaviaLoadBalancerOnboarding',
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
      hasPrivateNetwork: /* @ngInject */ ($http, $stateParams) =>
        $http
          .get(`/cloud/project/${$stateParams.projectId}/network/private`)
          .then(({ data }) => data && data.length > 0),
    },
    params: {
      showNoPrivateNetworkModal: false,
    },
    atInternet: {
      rename: TRACKING_NAME,
    },
  });
};
