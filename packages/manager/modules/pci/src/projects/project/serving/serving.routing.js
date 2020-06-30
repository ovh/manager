export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.serving', {
    url: '/serving',
    component: 'pciProjectServing',

    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('namespaces')
        .then((namespaces) => {
          if (namespaces.length === 0) {
            return { state: 'pci.projects.project.serving.onboarding' };
          }
          return false;
        }),

    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_serving_title'),
      lab: /* @ngInject */ (PciProjectLabsService, projectId) =>
        PciProjectLabsService.getLabByName(projectId, 'serving'),

      namespaces: /* @ngInject */ (PciProjectServingService, projectId) =>
        PciProjectServingService.getAll(projectId),
      viewNamespace: /* @ngInject */ ($state, projectId) => (namespace) =>
        $state.go('pci.projects.project.serving.namespace', {
          projectId,
          namespaceId: namespace.id,
        }),
      listModels: /* @ngInject */ ($state, projectId) => (namespace) =>
        $state.go('pci.projects.project.serving.namespace.models', {
          projectId,
          namespaceId: namespace.id,
        }),
      deployModel: /* @ngInject */ ($state, projectId) => (namespace) =>
        $state.go('pci.projects.project.serving.namespace.models.add', {
          projectId,
          namespaceId: namespace.id,
        }),
      deleteNamespace: /* @ngInject */ ($state, projectId) => (namespace) =>
        $state.go('pci.projects.project.serving.delete', {
          projectId,
          namespaceId: namespace.id,
        }),
      addNamespaceLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.serving.add', {
          projectId,
        }),
      namespaceLink: /* @ngInject */ ($state, projectId) => (namespace) =>
        $state.href('pci.projects.project.serving.namespace', {
          projectId,
          namespaceId: namespace.id,
        }),
      goToNamespace: /* @ngInject */ ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.serving',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](message, 'pci.projects.project.serving'),
          );
        }

        return promise;
      },
    },
  });
};
