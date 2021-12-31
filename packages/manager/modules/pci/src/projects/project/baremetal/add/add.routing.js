import { INCLUDE_FLAVOR_CATEGORIES } from './add.constants';
import { BAREMETAL_CATEGORY } from '../baremetal.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.add', {
    url: '/new',
    component: 'ovhManagerPciInstancesAdd',
    resolve: {
      addInstanceSuccessMessage: () =>
        'pci_projects_project_baremetal_add_success_message',

      addInstancesSuccessMessage: () =>
        'pci_projects_project_baremetal_add_success_multiple_message',

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

      regions: /* @ngInject */ (PciProjectsProjectInstanceService, projectId) =>
        PciProjectsProjectInstanceService.getAvailablesRegions(projectId),

      cancelLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.baremetal', {
          projectId,
        }),

      quotaLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.quota', {
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

      selectedCategory: () => BAREMETAL_CATEGORY,

      includeCategories: () => INCLUDE_FLAVOR_CATEGORIES,
    },
  });
};
