export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup.upgrade', {
    url: '/upgrade',
    views: {
      modal: {
        component: 'dedicatedCloudDatacenterBackupUpgrade',
      },
    },
    layout: 'modal',
  });
};
