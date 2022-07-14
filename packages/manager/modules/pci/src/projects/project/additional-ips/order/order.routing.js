import filter from 'lodash/filter';
import find from 'lodash/find';

import { TRACKING_PREFIX } from '../additional-ips.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.order', {
    url: '/order?ipType&region&instance',
    component: 'pciProjectAdditionalIpsOrder',
    params: {
      ipType: {
        dynamic: true,
        type: 'string',
      },
      region: {
        dynamic: true,
        type: 'string',
      },
      instance: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      defaults: /* @ngInject */ ($transition$) => ({
        ipType: $transition$.params().ipType,
        region: $transition$.params().region,
        instance: $transition$.params().instance,
      }),
      publicCloudCatalog: /* @ngInject */ (
        PciProjectAdditionalIpService,
        coreConfig,
      ) =>
        PciProjectAdditionalIpService.getPublicCloudCatalog({
          ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
          productName: 'cloud',
        }),
      breadcrumb: /* @ngInject */ () => null,
      goBack: /* @ngInject */ (goToAdditionalIps) => goToAdditionalIps,
      instances: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) =>
        PciProjectsProjectInstanceService.getAllInstanceDetails(
          projectId,
        ).then((instances) =>
          filter(instances, ({ ipAddresses }) =>
            find(ipAddresses, { type: 'private' }),
          ),
        ),
      createInstanceUrl: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.instances.add', {
          projectId,
        }),
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::add`,
    },
  });
};
