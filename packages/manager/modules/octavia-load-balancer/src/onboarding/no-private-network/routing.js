import { TRACKING_CHAPTER_1, TRACKING_NAME } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.onboarding.no-private-network', {
    url: '/no-private-network',
    resolve: {
      breadcrumb: () => null,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      goToPrivateNetworkCreation: /* @ngInject */ (
        atInternet,
        $injector,
        projectId,
        coreURLBuilder,
        $q,
      ) => () => {
        atInternet.trackClick({
          name: `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::create-private-network::add-private-network`,
          type: 'navigation',
        });
        if ($injector.has('shellClient')) {
          return $injector
            .get('shellClient')
            .navigation.getURL(
              'public-cloud',
              `#/pci/projects/${projectId}/private-networks/new`,
            )
            .then((url) => {
              window.location.href = url;
            });
        }
        window.location.href = coreURLBuilder.buildURL(
          'public-cloud',
          `#/pci/projects/${projectId}/private-networks/new`,
        );
        return $q.when(null);
      },
    },
    views: {
      modal: {
        component: 'octaviaLoadBalancerOnboardingNoPrivateNetwork',
      },
    },
    layout: 'modal',
    atInternet: {
      rename: `${TRACKING_NAME}::create-private-network`,
    },
  });
};
