import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.failover-ips', {
    url: '/failover-ips?ip',
    component: 'pciProjectFailoverIps',
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
        .getAsync('failoverIps')
        .then((failoverIps) =>
          failoverIps.length === 0
            ? { state: 'pci.projects.project.failover-ips.onboarding' }
            : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate
          .refresh()
          .then(() =>
            $translate.instant('pci_projects_project_failoverip_title'),
          ),
      failoverIp: /* @ngInject */ ($transition$) => $transition$.params().ip,
      failoverIps: /* @ngInject */ (
        $q,
        OvhApiCloudProject,
        OvhApiCloudProjectIpFailover,
        projectId,
      ) =>
        $q
          .all({
            failoverIps: OvhApiCloudProjectIpFailover.v6().query({
              serviceName: projectId,
            }).$promise,
            instances: OvhApiCloudProject.Instance()
              .v6()
              .query({
                serviceName: projectId,
              }).$promise,
          })
          .then(({ failoverIps, instances }) =>
            map(failoverIps, (failoverIp) => ({
              ...failoverIp,
              instance: failoverIp.routedTo
                ? find(instances, { id: failoverIp.routedTo })
                : null,
            })),
          ),

      failoverIpsRegions: /* @ngInject */ (failoverIps) =>
        Array.from(new Set(failoverIps.map(({ geoloc }) => geoloc))),

      goToFailoverIps: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.failover-ips',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](message, 'pci.projects.project.failover-ips'),
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
    },
  });
};
