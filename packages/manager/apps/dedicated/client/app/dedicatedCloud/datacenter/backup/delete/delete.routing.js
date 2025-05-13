export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.backup.delete',
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
