import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.serving', {
    url: '/serving?id',
    component: 'pciProjectServing',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.SERVING);
    },
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

      namespacesRegions: /* @ngInject */ (namespaces) =>
        Array.from(new Set(namespaces.map(({ region }) => region))),

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
      namespaceId: /* @ngInject */ ($transition$) => $transition$.params().id,
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
