export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.public-gateways', {
    url: '/public-gateways',
    component: 'pciProjectPublicGateways',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('publicGateways')
        .then((publicGateways) =>
          publicGateways.length === 0
            ? { state: 'pci.projects.project.public-gateways.onboarding' }
            : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_public_gateway_title'),
      publicGateways: /* @ngInject */ (PciPublicGatewaysService, projectId) =>
        PciPublicGatewaysService.getPublicGateways(projectId),
      publicGatewaysTrackPrefix: () =>
        'PublicCloud::pci::projects::project::public-gateway',

      trackPublicGateways: /* @ngInject */ (
        publicGatewaysTrackPrefix,
        trackClick,
        trackPage,
      ) => (complement, type = 'action', prefix = true) => {
        const name = `${
          prefix ? `${publicGatewaysTrackPrefix}::` : ''
        }${complement}`;
        switch (type) {
          case 'action':
          case 'navigation':
            trackClick(name, type);
            break;
          case 'page':
            trackPage(name);
            break;
          default:
            trackClick(name);
        }
      },

      trackClick: /* @ngInject */ (atInternet) => (hit, type = 'action') => {
        atInternet.trackClick({
          name: hit,
          type,
        });
      },

      trackPage: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackPage({
          name: hit,
        });
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
