export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.backup.spla-licence',
    {
      url: '/spla-licence',
      component: 'dedicatedCloudDatacenterBackupSplaLicence',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
