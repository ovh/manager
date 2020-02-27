export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'dedicatedCloudBackupDelete',
      },
    },
    layout: 'modal',
  });
};
