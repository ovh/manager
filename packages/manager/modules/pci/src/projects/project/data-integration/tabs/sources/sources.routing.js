import { DATA_INTEGRATION_TRACKING_PREFIX } from '../../data-integration.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-integration.sources', {
    url: '/sources',
    views: {
      dataIntegrationTabUiView: 'pciProjectDataIntegrationSources',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb,
      sourceConnectors: /* @ngInject */ (DataIntegrationService, projectId) =>
        DataIntegrationService.getSourceConnectors(projectId),
      sources: /* @ngInject */ (
        DataIntegrationService,
        sourceConnectors,
        projectId,
      ) =>
        DataIntegrationService.getSources(projectId).then((sources) =>
          sources.map((source) => {
            const connector = sourceConnectors.find(
              (sourceConnector) => sourceConnector.id === source.connectorId,
            );
            return {
              ...source,
              connectorName: connector?.name,
              connectorVersion: connector?.version,
            };
          }),
        ),
      cliLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.data-integration.cli', {
          projectId,
        }),
    },
    atInternet: {
      rename: `${DATA_INTEGRATION_TRACKING_PREFIX}::sources`,
    },
  });
};
