export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup.new', {
    url: '/new',
    component: 'ovhManagerDedicatedCloudBackupNew',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('backup')
        .then((backup) => {
          if (!(backup.isInactive() || backup.isLegacy())) {
            return { state: 'app.dedicatedClouds.datacenter.backup' };
          }
          return false;
        }),
    translations: { value: ['.'], format: 'json' },
  });
};
