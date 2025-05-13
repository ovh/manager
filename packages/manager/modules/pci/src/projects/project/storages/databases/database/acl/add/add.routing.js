export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.acl.add',
    {
      url: '/add',
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseAclAddComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToAcl) => goBackToAcl,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
