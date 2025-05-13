export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.backup.spla-licence',
    {
      url: '/spla-licence',
      component: 'dedicatedCloudDatacenterBackupSplaLicence',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
