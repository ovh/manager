import map from 'lodash/map';
import { TABS, TRACKING_PREFIX } from './additional-ips.constants';
import { PCI_FEATURES } from '../../projects.constant';

const getStateToNavigate = (activeTab = TABS.FAILOVER_IP) =>
  activeTab === TABS.FLOATING_IP
    ? 'pci.projects.project.additional-ips.floating-ips'
    : 'pci.projects.project.additional-ips.failover-ips';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips', {
    url: '/additional-ips',
    component: 'pciProjectAdditionalIps',
    translations: {
      format: 'json',
      value: ['.'],
    },
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.FAILOVER_IP);
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('additionalIps')
        .then((additionalIps) =>
          additionalIps.failoverIps.length === 0 &&
          additionalIps.floatingIps.length === 0
            ? { state: 'pci.projects.project.additional-ips.onboarding' }
            : { state: getStateToNavigate() },
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate
          .refresh()
          .then(() => $translate.instant('pci_additional_ips_title')),
      additionalIps: /* @ngInject */ (
        $q,
        OvhApiCloudProject,
        OvhApiCloudProjectIpFailover,
        projectId,
        getFloatingIps,
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
              })
              .$promise.then((instances) =>
                instances.reduce((accumulator, instance) => {
                  accumulator[instance.id] = instance;
                  return accumulator;
                }, {}),
              ),
            floatingIps: getFloatingIps(),
          })
          .then(({ failoverIps, instances, floatingIps }) => {
            return {
              failoverIps: map(failoverIps, (failoverIp) => ({
                ...failoverIp,
                instance: failoverIp.routedTo
                  ? instances[failoverIp.routedTo]
                  : null,
              })),
              floatingIps: map(floatingIps, (floatingIp) => ({
                ...floatingIp,
                instance:
                  floatingIp.associatedEntity?.type === 'instance'
                    ? instances[floatingIp.associatedEntity?.id]
                    : null,
              })),
            };
          }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),

      failoverIpsLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.additional-ips.failover-ips', {
          projectId,
        }),

      floatingIpsLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.additional-ips.floating-ips', {
          projectId,
        }),

      getFloatingIps: /* @ngInject */ (
        $http,
        $q,
        OvhApiCloudProjectRegion,
        projectId,
      ) => () =>
        OvhApiCloudProjectRegion.v6()
          .query({
            serviceName: projectId,
          })
          .$promise.then((regions) => {
            return $q
              .all(
                regions.map((region) =>
                  $http
                    .get(
                      `/cloud/project/${projectId}/region/${region}/floatingip `,
                    )
                    .then(({ data }) => data.map((ip) => ({ ...ip, region })))
                    .catch(() => []),
                ),
              )
              .then((floatingIpsData) => floatingIpsData.flat());
          }),

      goToAdditionalIps: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
        activeTab = TABS.FAILOVER_IP,
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          getStateToNavigate(activeTab),
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
      goToAdditionalIpOrderPage: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.additional-ips.order', {
          projectId,
        }),
      trackClick: /* @ngInject */ (atInternet) => (
        label = '',
        includePrefix = true,
      ) =>
        atInternet.trackClick({
          name: includePrefix ? `${TRACKING_PREFIX}::${label}` : label,
          type: 'action',
        }),
    },
  });
};
