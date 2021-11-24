import Datacenter from '../../../../../components/project/regions-list/datacenter.class';
import { FLAVORS_FEATURES_FLIPPING_MAP } from '../../instances.constants';
import { EXCLUDE_FLAVOR_CATEGORIES } from '../../add/add.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance.edit', {
    url: '/edit',
    views: {
      '@pci.projects.project.instances': {
        component: 'pciProjectsProjectInstancesInstanceEdit',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_instances_instance_edit_title',
        ),

      instanceId: /* @ngInject */ ($transition$) =>
        $transition$.params().instanceId,

      instance: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instanceId,
      ) => PciProjectsProjectInstanceService.get(projectId, instanceId),

      region: /* @ngInject */ ($http, $q, instance, projectId) =>
        $q
          .all({
            region: $http
              .get(`/cloud/project/${projectId}/region/${instance.region}`)
              .then(({ data }) => data),
            quota: $http
              .get(
                `/cloud/project/${projectId}/region/${instance.region}/quota`,
              )
              .then(({ data }) => data),
          })
          .then(
            ({ region, quota }) =>
              new Datacenter({
                ...region,
                quota,
              }),
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

      goBack: /* @ngInject */ (goToInstance) => goToInstance,
    },
  });
};
