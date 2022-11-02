import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

import { VRACK_OPERATION_COMPLETED_STATUS } from './private-networks.constants';
import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork', {
    url: '/private-networks?id',
    component: 'pciProjectPrivateNetworks',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('operation')
        .then((operation) => {
          if (isObject(operation)) {
            return VRACK_OPERATION_COMPLETED_STATUS.includes(operation.status)
              ? false
              : { state: 'pci.projects.project.privateNetwork.vrack' };
          }

          return transition
            .injector()
            .getAsync('vrack')
            .then((vrack) =>
              isEmpty(vrack)
                ? { state: 'pci.projects.project.privateNetwork.vrack' }
                : false,
            );
        }),
    resolve: {
      createNetwork: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.privateNetwork.add', { projectId }),

      deleteSubnet: /* @ngInject */ (
        $state,
        projectId,
        trackPrivateNetworks,
      ) => (networkId, region) => {
        trackPrivateNetworks(`table-option-menu::delete`);
        return $state.go('pci.projects.project.privateNetwork.delete', {
          projectId,
          networkId,
          region,
        });
      },
      networkId: /* @ngInject */ ($transition$) => $transition$.params().id,
      privateNetworks: /* @ngInject */ (PciPrivateNetworks, projectId) =>
        PciPrivateNetworks.getPrivateNetworks(projectId),
      goToAddPublicGateway: /* @ngInject */ (
        $state,
        projectId,
        trackPrivateNetworks,
      ) => (network) => {
        trackPrivateNetworks(`table-option-menu::assign-public-gateway`);
        return $state.go('pci.projects.project.gateways.add', {
          projectId,
          network: network.networkId,
          region: network.region,
        });
      },
      privateNetworksRegions: /* @ngInject */ (privateNetworks) =>
        Array.from(
          new Set(
            privateNetworks.reduce(
              (acc, { subnets }) =>
                acc.concat(subnets.map(({ region }) => region)),
              [],
            ),
          ),
        ),

      vrack: /* @ngInject */ (PciPrivateNetworks, projectId) =>
        PciPrivateNetworks.getVrack(projectId),

      operation: /* @ngInject */ (PciPrivateNetworks, projectId) =>
        PciPrivateNetworks.getVrackCreationOperation(projectId),
      gateways: /* @ngInject */ (PciPrivateNetworks, projectId) =>
        PciPrivateNetworks.getGateways(projectId),
      gatewaysLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.gateways', {
          projectId,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_network_private'),

      goToPrivateNetworks: /* @ngInject */ (
        $state,
        CucCloudMessage,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.privateNetwork',
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
              'pci.projects.project.privateNetwork',
            ),
          );
        }

        return promise;
      },
      privateNetworkTrackPrefix: () =>
        'PublicCloud::pci::projects::project::privateNetwork',
      trackPrivateNetworks: /* @ngInject */ (
        privateNetworkTrackPrefix,
        trackClick,
        trackPage,
      ) => (complement, type = 'action', prefix = true) => {
        const name = `${
          prefix ? `${privateNetworkTrackPrefix}::` : ''
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

    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.PRIVATE_NETWORK);
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
    atInternet: {
      rename: 'pci::projects::project::privateNetwork',
    },
  });
};
