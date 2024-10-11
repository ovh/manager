export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.object-storage.objects', {
    url: '',
    component: 'pciProjectStorageContainers',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containersResponseObj')
        .then(({ resources, errors }) =>
          resources.length === 0 && errors.length === 0
            ? {
                state:
                  'pci.projects.project.storages.object-storage.onboarding',
              }
            : false,
        ),
    resolve: {
      archive: () => false,
      containerId: /* @ngInject */ ($transition$) => $transition$.params().id,

      addContainer: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.object-storage.add', {
          projectId,
        }),
      viewContainer: /* @ngInject */ (
        $state,
        projectId,
        atInternet,
        trackingPrefix,
      ) => (container) => {
        atInternet.trackClick({
          name: `${trackingPrefix}see-objects`,
          type: 'action',
        });
        return $state.go(
          'pci.projects.project.storages.object-storage.objects.object',
          {
            projectId,
            containerId: container.id,
          },
        );
      },
      deleteContainer: /* @ngInject */ (
        $state,
        projectId,
        atInternet,
        trackingPrefix,
      ) => (container) => {
        atInternet.trackClick({
          name: `${trackingPrefix}delete`,
          type: 'action',
        });
        return $state.go(
          'pci.projects.project.storages.object-storage.objects.delete',
          {
            projectId,
            containerId: container.id,
          },
        );
      },
      goToAddUserContainer: /* @ngInject */ (
        $state,
        projectId,
        atInternet,
        trackingPrefix,
      ) => (container) => {
        atInternet.trackClick({
          name: `${trackingPrefix}add-user`,
          type: 'action',
        });
        return $state.go(
          'pci.projects.project.storages.object-storage.objects.addUser',
          {
            projectId,
            containerId: container.id,
          },
        );
      },
      containerLink: /* @ngInject */ ($state, projectId) => (container) =>
        $state.href(
          'pci.projects.project.storages.object-storage.objects.object',
          {
            projectId,
            containerId: container.id,
            region: container.region,
          },
        ),

      refreshContainers: /* @ngInject */ ($state) => () => $state.reload(),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_object_title',
        ),
    },
    atInternet: {
      rename: 'pci::projects::project::storages::objects',
    },
  });
};
