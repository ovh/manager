export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.cold-archive.onboarding',
    {
      url: '/onboarding',
      views: {
        'coldArchiveView@pci.projects.project.storages.cold-archive': {
          component: 'pciProjectStorageColdArchiveOnboarding',
        },
      },
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('containers')
          .then((containers) =>
            containers.length > 0
              ? {
                  state:
                    'pci.projects.project.storages.cold-archive.containers',
                }
              : false,
          ),
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
      },
    },
  );
};
