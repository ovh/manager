export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.backup.spla-licence', {
    url: '/spla-licence',
    component: 'dedicatedCloudDatacenterBackupSplaLicence',
  });
};
