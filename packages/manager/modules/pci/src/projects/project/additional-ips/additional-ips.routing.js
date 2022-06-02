import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips', {
    url: '/additional-ips?ip',
    component: 'pciProjectAdditionalIps',
    translations: {
      format: 'json',
      value: ['.'],
    },
    params: {
      ip: {
        dynamic: true,
        type: 'string',
      },
    },
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.FAILOVER_IP);
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('additionalIps')
        .then((additionalIps) =>
          additionalIps.length === 0
            ? { state: 'pci.projects.project.additional-ips.onboarding' }
            : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate
          .refresh()
          .then(() => $translate.instant('pci_additional_ips_title')),
      additionalIp: /* @ngInject */ ($transition$) => $transition$.params().ip,
      additionalIps: /* @ngInject */ (
        $q,
        OvhApiCloudProject,
        OvhApiCloudProjectIpFailover,
        projectId,
      ) =>
        $q
          .all({
            additionalIps: OvhApiCloudProjectIpFailover.v6().query({
              serviceName: projectId,
            }).$promise,
            instances: OvhApiCloudProject.Instance()
              .v6()
              .query({
                serviceName: projectId,
              }).$promise,
          })
          .then(({ additionalIps, instances }) =>
            map(additionalIps, (additionalIp) => ({
              ...additionalIp,
              instance: additionalIp.routedTo
                ? find(instances, { id: additionalIp.routedTo })
                : null,
            })),
          ),

      additionalIpsRegions: /* @ngInject */ (additionalIps) =>
        Array.from(new Set(additionalIps.map(({ geoloc }) => geoloc))),

      goToAdditionalIps: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.additional-ips',
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
              'pci.projects.project.additional-ips',
            ),
          );
        }

        return promise;
      },

      instances: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) =>
        PciProjectsProjectInstanceService.getAllInstanceDetails(
          projectId,
        ).then((instances) =>
          filter(instances, ({ ipAddresses }) =>
            find(ipAddresses, { type: 'public' }),
          ),
        ),

      createInstanceUrl: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.instances.add', {
          projectId,
        }),
      goToAdditionalIpOrderPage: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.additional-ips.order', {
          projectId,
        }),
    },
  });
};
