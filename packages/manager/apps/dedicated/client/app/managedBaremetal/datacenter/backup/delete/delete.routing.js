export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.backup.delete',
    {
      url: '/delete',
      views: {
        modal: {
          component: 'dedicatedCloudDatacenterBackupDelete',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
