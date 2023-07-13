import { DATA_INTEGRATION_TRACKING_PREFIX } from '../data-integration.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-integration.onboarding', {
    url: '/onboarding',
    component: 'pciProjectDataIntegrationOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('workflows')
        .then((workflows) =>
          workflows.length > 0
            ? { state: 'pci.projects.project.data-integration' }
            : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb,
      goToCli: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.project.data-integration.cli'),
    },
    atInternet: {
      rename: `${DATA_INTEGRATION_TRACKING_PREFIX}::onboarding`,
    },
  });
};
