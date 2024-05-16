import { FLAVORS_FEATURES_FLIPPING_MAP } from '../instances.constants';
import { URL_MODEL } from './add.constants';
import { useURLModel } from '../../project.utils';

export default /* @ngInject */ ($stateProvider) => {
  const { query } = useURLModel(URL_MODEL);
  $stateProvider.state('pci.projects.project.instances.add', {
    url: `/new?${query}`,
    component: 'ovhManagerPciInstancesAdd',
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

      addPrivateNetworksLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.privateNetwork', {
          projectId,
        }),
      addLocalPrivateNetworksLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.privateNetwork.add', {
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
      addInstanceTrackPrefix: /* @ngInject */ () =>
        `PublicCloud::pci::projects::project::instances::`,
      trackAddInstance: /* @ngInject */ (
        addInstanceTrackPrefix,
        trackClick,
        trackPage,
      ) => (complement, type = 'action', prefix = true) => {
        const name = `${
          prefix ? `${addInstanceTrackPrefix}` : ''
        }${complement}`;
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
