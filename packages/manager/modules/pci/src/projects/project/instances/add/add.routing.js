import find from 'lodash/find';
import { EXCLUDE_FLAVOR_CATEGORIES } from './add.constants';
import { FLAVORS_FEATURES_FLIPPING_MAP } from '../instances.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.add', {
    url: '/new',
    component: 'ovhManagerPciInstancesAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_instances_add_title'),

      offer: /* @ngInject */ ($q, deals, iceberg, projectId) =>
        deals.active
          ? iceberg('/cloud/project/:serviceName/credit')
              .query()
              .expand('CachedObjectList-Pages')
              .execute({ serviceName: projectId })
              .$promise.then(({ data }) =>
                find(data, (voucher) =>
                  deals.descriptionPattern.test(voucher.description),
                ),
              )
              .then((vouchers) =>
                deals.display.includes('instance-creation-price') && vouchers
                  ? deals
                  : null,
              )
              .catch(() => null)
          : $q.when(null),

      privateNetworks: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getPrivateNetworks(projectId),

      publicNetwork: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getPublicNetwork(projectId),

      regions: /* @ngInject */ (PciProjectsProjectInstanceService, projectId) =>
        PciProjectsProjectInstanceService.getAvailablesRegions(projectId),
      quotaLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.quota', {
          projectId,
        }),
      regionsLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.regions', {
          projectId,
        }),

      addPrivateNetworksLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.privateNetwork', {
          projectId,
        }),

      goBack: /* @ngInject */ (goToInstances) => goToInstances,

      prices: /* @ngInject */ (
        me,
        PciProjectsProjectInstanceService,
        project,
        catalogEndpoint,
      ) =>
        PciProjectsProjectInstanceService.getExtraBandwidthCost(
          catalogEndpoint,
          project,
          me,
        ),

      excludeCategories: /* @ngInject */ (pciFeatures) => {
        const flavorCategories = Object.keys(FLAVORS_FEATURES_FLIPPING_MAP);
        const toExclude = flavorCategories.filter((flavor) => {
          return !pciFeatures.isFeatureAvailable(
            FLAVORS_FEATURES_FLIPPING_MAP[flavor],
          );
        });

        return EXCLUDE_FLAVOR_CATEGORIES.concat(toExclude);
      },
      getProductCatalog: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        catalogEndpoint,
        coreConfig,
      ) =>
        PciProjectsProjectInstanceService.getCatalog(
          catalogEndpoint,
          coreConfig.getUser(),
        ).then((data) => {
          return data.addons
            .filter(
              (addon) =>
                (addon.product.startsWith('publiccloud-gateway') &&
                  addon.planCode.startsWith('gateway.s.month.consumption')) ||
                (addon.product.startsWith(
                  'publiccloud-floatingip-floatingip',
                ) &&
                  addon.planCode.startsWith(
                    'floatingip.floatingip.month.consumption',
                  )),
            )
            .reverse();
        }),
      addInstanceTrackPrefix: /* @ngInject */ () =>
        `PublicCloud::pci::projects::project::instances::`,
      trackAddInstance: /* @ngInject */ (
        atInternet,
        addInstanceTrackPrefix,
      ) => (complement, prefix = true) => {
        const name = `${
          prefix ? `${addInstanceTrackPrefix}` : ''
        }${complement}`;
        return atInternet.trackClick({
          name,
          type: 'action',
        });
      },
    },
  });
};
