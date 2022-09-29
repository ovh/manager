export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.onboarding',
    {
      url: '/onboarding',
      component: 'pciProjectStorageObjectsOnboarding',
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('containers')
          .then((containers) =>
            containers.length > 0
              ? {
                  state: 'pci.projects.project.storages.object-storage.objects',
                }
              : false,
          ),
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
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
