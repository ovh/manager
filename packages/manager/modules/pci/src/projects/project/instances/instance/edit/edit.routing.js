import Datacenter from '../../../../../components/project/regions-list/datacenter.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance.edit', {
    url: '/edit',
    views: {
      '@pci.projects.project.instances': {
        component: 'pciProjectsProjectInstancesInstanceEdit',
      },
    },
    resolve: {
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
      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_instances_instance_edit_title',
        ),
    },
  });
};
