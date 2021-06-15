export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.databases.onboarding', {
    url: '/onboarding',
    component: 'pciProjectStoragesDatabasesOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('databases')
        .then((databases) =>
          databases.length > 0
            ? { state: 'pci.projects.project.storages.databases' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
