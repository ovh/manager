export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup.new', {
    url: '/new',
    component: 'dedicatedCloudDatacenterBackupNew',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('backup')
        .then((backup) => {
          if (
            !(backup.isInactive() || (backup.isLegacy() && backup.isActive()))
          ) {
            return { state: 'app.dedicatedClouds.datacenter.backup' };
          }
          return false;
        }),
    resolve: {
      defaultPaymentMethod: (ovhPaymentMethod) =>
        ovhPaymentMethod.getDefaultPaymentMethod(),
    },
  });
};
