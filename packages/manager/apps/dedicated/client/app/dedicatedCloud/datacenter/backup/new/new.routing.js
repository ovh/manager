export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup.new', {
    url: '/new',
    component: 'ovhManagerDedicatedCloudBackupNew',
    translations: { value: ['.'], format: 'json' },
  });
};
