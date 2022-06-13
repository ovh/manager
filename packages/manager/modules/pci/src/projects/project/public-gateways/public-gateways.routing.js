import {
  PUBLIC_GATEWAY_CATALOG_ADDON_PRODUCT_NAME,
  PUBLIC_GATEWAY_ADDON_PRODUCT_S,
  PUBLIC_GATEWAY_ADDON_PRODUCT_M,
  PUBLIC_GATEWAY_ADDON_PRODUCT_L,
} from './public-gateways.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.public-gateways', {
    url: '/public-gateways',
    component: 'pciProjectPublicGateways',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('gateways')
        .then((gateways) =>
          gateways.length === 0
            ? { state: 'pci.projects.project.public-gateways.onboarding' }
            : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_public_gateway_title'),
      gateways: /* @ngInject */ (PciPublicGatewaysService, projectId) =>
        PciPublicGatewaysService.getGateways(projectId),
      gatewayCatalog: /* @ngInject */ (PciPublicGatewaysService, coreConfig) =>
        PciPublicGatewaysService.getGatwayCatalog({
          ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
          productName: PUBLIC_GATEWAY_CATALOG_ADDON_PRODUCT_NAME.toLowerCase(),
        }).then((data) => {
          return data.addons.filter(
            (addon) =>
              addon.product === PUBLIC_GATEWAY_ADDON_PRODUCT_S ||
              addon.product === PUBLIC_GATEWAY_ADDON_PRODUCT_M ||
              addon.product === PUBLIC_GATEWAY_ADDON_PRODUCT_L,
          );
        }),
      goToDeleteGateway: /* @ngInject */ (
        $state,
        projectId,
        trackPublicGateways,
      ) => (gateway) => {
        trackPublicGateways('table-option-menu::delete');
        return $state.go('pci.projects.project.public-gateways.delete', {
          projectId,
          gateway,
        });
      },
      goToEditGateway: /* @ngInject */ (
        $state,
        projectId,
        trackPublicGateways,
      ) => (gateway) => {
        trackPublicGateways('table-option-menu::update');
        return $state.go('pci.projects.project.public-gateways.edit', {
          projectId,
          gateway,
        });
      },
      goToPrivateNetwork: /* @ngInject */ ($state) => (projectId) =>
        $state.go('pci.projects.project.privateNetwork', {
          projectId,
        }),
      publicGatewaysTrackPrefix: () =>
        'PublicCloud::pci::projects::project::public-gateway::',
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
      goBack: /* @ngInject */ (goToPublicGateway) => (message, type) =>
        goToPublicGateway(message, type),
      goToPublicGateway: /* @ngInject */ (
        $state,
        CucCloudMessage,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'pci.projects.project.public-gateways',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.public-gateways',
            ),
          );
        }

        return promise;
      },
    },
    atInternet: {
      rename: 'PublicCloud::pci::projects::project::public-gateway',
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
