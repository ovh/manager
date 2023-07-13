import { DATA_INTEGRATION_TRACKING_PREFIX } from '../../data-integration.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-integration.cli', {
    url: '/cli',
    views: {
      dataIntegrationTabUiView: 'pciProjectDataIntegrationCli',
    },
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb,
    },
    atInternet: {
      rename: `${DATA_INTEGRATION_TRACKING_PREFIX}::cli`,
    },
  });
};
