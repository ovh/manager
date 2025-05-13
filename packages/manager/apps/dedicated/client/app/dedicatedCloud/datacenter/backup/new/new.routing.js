export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.backup.new',
    {
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
              return {
                state: 'app.dedicatedCloud.details.datacenter.details.backup',
              };
            }
            return false;
          }),
      resolve: {
        defaultPaymentMethod: (ovhPaymentMethod) =>
          ovhPaymentMethod.getDefaultPaymentMethod(),
        breadcrumb: () => null,
      },
    },
  );
};
