import {
  DATACENTER_BACKUP_STATE,
  redirectToBackupTabWhenOrderBlockedByManagedBackupForVmware,
} from '../backup-order-availability';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.backup.new',
    {
      url: '/new',
      component: 'dedicatedCloudDatacenterBackupNew',
      redirectTo: (transition) =>
        redirectToBackupTabWhenOrderBlockedByManagedBackupForVmware(
          transition,
        ).then(
          (redirection) =>
            redirection ||
            transition
              .injector()
              .getAsync('backup')
              .then((backup) => {
                if (
                  !(
                    backup.isInactive() ||
                    (backup.isLegacy() && backup.isActive())
                  )
                ) {
                  return {
                    state: DATACENTER_BACKUP_STATE,
                  };
                }
                return false;
              }),
        ),
      resolve: {
        defaultPaymentMethod: (ovhPaymentMethod) =>
          ovhPaymentMethod.getDefaultPaymentMethod(),
        breadcrumb: () => null,
      },
    },
  );
};
