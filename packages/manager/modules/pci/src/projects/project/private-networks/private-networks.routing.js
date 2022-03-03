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
    resolve: {
      createNetwork: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.privateNetwork.add', { projectId }),

      deleteNetwork: /* @ngInject */ ($state, projectId) => (networkId) =>
        $state.go('pci.projects.project.privateNetwork.delete', {
          projectId,
          networkId,
        }),

      networkId: /* @ngInject */ ($transition$) => $transition$.params().id,

      privateNetworks: /* @ngInject */ (PciPrivateNetworks, projectId) =>
        PciPrivateNetworks.getPrivateNetworks(projectId),

      privateNetworksRegions: /* @ngInject */ (privateNetworks) =>
        Array.from(
          new Set(
            privateNetworks.reduce(
              (acc, { regions }) =>
                acc.concat(regions.map(({ region }) => region)),
              [],
            ),
          ),
        ),

      vrack: /* @ngInject */ (PciPrivateNetworks, projectId) =>
        PciPrivateNetworks.getVrack(projectId),

      operation: /* @ngInject */ (PciPrivateNetworks, projectId) =>
        PciPrivateNetworks.getVrackCreationOperation(projectId),

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
    },

    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.PRIVATE_NETWORK);
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

    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
