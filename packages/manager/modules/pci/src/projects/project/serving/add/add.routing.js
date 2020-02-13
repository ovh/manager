export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.serving.add', {
    url: '/new',
    component: 'ovhManagerPciServingAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('pci_projects_project_serving_add_title'),
      cancelLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.serving', {
        projectId,
      }),
      regions: /* @ngInject */ (
        ovhManagerPciServingAdd,
        projectId,
      ) => ovhManagerPciServingAdd.getAvailableRegions(projectId),
      addNamespace: /* @ngInject */ (
        $translate,
        $state,
        CucCloudMessage,
        ovhManagerPciServingAdd,
        projectId,
      ) => (namespaceCreation) => ovhManagerPciServingAdd
        .addNamespace(projectId, namespaceCreation)
        .then(({ name, id }) => {
          const promise = $state.go('pci.projects.project.serving.namespace.infos', {
            projectId,
            namespaceId: id,
          },
          {
            reload: true,
          });

          promise.then(() => CucCloudMessage.success($translate.instant('pci_projects_project_serving_add_success', { name }), 'pci.projects.project.serving.namespace.infos'));
        }),
    },
  });
};
