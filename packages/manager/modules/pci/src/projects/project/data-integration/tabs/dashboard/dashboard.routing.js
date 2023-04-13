import { DATA_INTEGRATION_TRACKING_PREFIX } from '../../data-integration.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-integration.dashboard', {
    url: '/dashboard',
    views: {
      dataIntegrationTabUiView: 'pciProjectDataIntegrationDashboard',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb,
      cliLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.data-integration.cli', {
          projectId,
        }),
    },
    atInternet: {
      rename: `${DATA_INTEGRATION_TRACKING_PREFIX}::dashboard`,
    },
  });
};
