export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.backup.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'dedicatedCloudDatacenterBackupDelete',
      },
    },
    layout: 'modal',
  });
};
