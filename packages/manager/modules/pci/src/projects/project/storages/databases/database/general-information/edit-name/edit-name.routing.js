export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.name',
    {
      url: '/name',
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabaseGeneralInformationName',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
