export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai-dashboard.datastore.create-datastore',
    {
      url: '/create-datastore',
      views: {
        modal: {
          component: 'pciProjectAiDashboardCreateDatastoreModal',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
      },
    },
  );
};
