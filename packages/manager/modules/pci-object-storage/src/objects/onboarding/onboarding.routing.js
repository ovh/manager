export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.onboarding',
    {
      url: '/onboarding',
      views: {
        objectStorageView: {
          component: 'pciProjectStorageObjectsOnboarding',
        },
      },
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('containersResponseObj')
          .then(({ resources, errors }) =>
            resources.length !== 0 || errors.length !== 0
              ? {
                  state: 'pci.projects.project.storages.object-storage.objects',
                }
              : false,
          ),
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'pci_projects_project_storages_objects_onboarding_title',
          ),
        addObjectStorage: /* @ngInject */ (
          $state,
          projectId,
          atInternet,
          trackingPrefix,
        ) => () => {
          atInternet.trackClick({
            name: `${trackingPrefix}onboarding::add`,
            type: 'action',
          });
          return $state.go('pci.projects.project.storages.object-storage.add', {
            projectId,
          });
        },
      },
      atInternet: {
        rename: 'pci::projects::project::storages::objects::onboarding',
      },
    },
  );
};
