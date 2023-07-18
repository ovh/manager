import { DATA_INTEGRATION_TRACKING_PREFIX } from '../../data-integration.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-integration.destinations', {
    url: '/destinations',
    views: {
      dataIntegrationTabUiView: 'pciProjectDataIntegrationDestinations',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb,
      destinationConnectors: /* @ngInject */ (
        DataIntegrationService,
        projectId,
      ) => DataIntegrationService.getDestinationConnectors(projectId),
      destinations: /* @ngInject */ (
        DataIntegrationService,
        destinationConnectors,
        projectId,
      ) =>
        DataIntegrationService.getDestinations(projectId).then((destinations) =>
          destinations.map((destination) => {
            const connector = destinationConnectors.find(
              (destinationConnector) =>
                destinationConnector.id === destination.connectorId,
            );
            return {
              ...destination,
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
      rename: `${DATA_INTEGRATION_TRACKING_PREFIX}::destinations`,
    },
  });
};
