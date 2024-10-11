import { FLAVORS_FEATURES_FLIPPING_MAP } from '../instances.constants';
import {
  URL_MODEL,
  ADD_INSTANCE_TRACKING_PAGE_NAME,
  ADD_INSTANCE_TRACKING_PREFIX,
} from './add.constants';
import { useURLModel } from '../../project.utils';

export default /* @ngInject */ ($stateProvider) => {
  const { query } = useURLModel(URL_MODEL);
  $stateProvider.state('pci.projects.project.instances.add', {
    url: `/new?${query}`,
    component: 'ovhManagerPciInstancesAdd',
    atInternet: {
      rename: ADD_INSTANCE_TRACKING_PAGE_NAME,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_instances_add_title'),

      privateNetworks: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getPrivateNetworks(projectId),

      publicNetwork: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getPublicNetwork(projectId),

      regions: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        customerRegions,
      ) =>
        PciProjectsProjectInstanceService.getAvailablesRegions(
          projectId,
          customerRegions,
        ),
      quotaLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.quota', {
          projectId,
        }),
      regionsLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.regions', {
          projectId,
        }),

      projectActivationPageHref: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.activate', {
          projectId,
        }),
      addPrivateNetworksLink: /* @ngInject */ (getUAppUrl, projectId) =>
        getUAppUrl(
          'public-cloud',
          `#/pci/projects/${projectId}/private-networks`,
        ),
      addLocalPrivateNetworksLink: /* @ngInject */ (getUAppUrl, projectId) =>
        getUAppUrl(
          'public-cloud',
          `#/pci/projects/${projectId}/private-networks/add`,
        ),
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
        return flavorCategories.filter((flavor) => {
          return !pciFeatures.isFeatureAvailable(
            FLAVORS_FEATURES_FLIPPING_MAP[flavor],
          );
        });
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
          const floatingIpProducts = data.addons
            .filter((addon) =>
              addon.product.startsWith('publiccloud-floatingip-floatingip'),
            )
            .sort(
              (
                { pricings: [{ price: priceA }] },
                { pricings: [{ price: priceB }] },
              ) => priceA - priceB,
            )
            .filter(({ product }, index, arr) => product === arr[0].product);
          const [monthlyPriceObj] = floatingIpProducts.find(({ planCode }) =>
            planCode.includes('month'),
          )?.pricings;
          const [hourlyPriceObj] = floatingIpProducts.find(({ planCode }) =>
            planCode.includes('hour'),
          )?.pricings;
          return {
            product: floatingIpProducts[0].product,
            pricePerMonth: monthlyPriceObj.price,
            pricePerHour: hourlyPriceObj.price,
          };
        }),
      trackAddInstance: /* @ngInject */ (trackClick, trackPage) => (
        chapters,
        type = 'action',
        prefix = true,
      ) => {
        const name = [
          ...(prefix ? ADD_INSTANCE_TRACKING_PREFIX : []),
          ...chapters,
        ].join('::');
        return type === 'page' ? trackPage(name) : trackClick(name, type);
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
  });
};
