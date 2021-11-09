import component from './vps-veeam.component';
import { VPS } from '../vps/constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.veeam', {
    url: '/veeam',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
    resolve: {
      automatedBackupOption: /* @ngInject */ (
        $transition$,
        hasAutomatedBackupOption,
        VpsService,
      ) =>
        hasAutomatedBackupOption
          ? VpsService.getVeeamInfo($transition$.params().serviceName)
          : null,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_veeam'),
      goToVeeamRestore: /* @ngInject */ ($state) => (restorePoint) =>
        $state.go('vps.detail.veeam.restore', { restorePoint }),
      goToVeeamMount: /* @ngInject */ ($state) => (restorePoint, mount) =>
        $state.go('vps.detail.veeam.mount', { restorePoint, mount }),
      goToVeeamScheduleBackup: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.veeam.schedule-backup'),
      goToVpsUpgrade: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.configuration.upgrade'),
      goBack: /* @ngInject */ ($state) => () => $state.go('vps.detail.veeam'),
      hasAutomatedBackupOption: /* @ngInject */ (
        $transition$,
        isAutomatedBackupAvailable,
        VpsService,
      ) =>
        isAutomatedBackupAvailable
          ? VpsService.getVpsOption(
              $transition$.params().serviceName,
              VPS.OPTIONS.AUTOMATED_BACKUP,
            )
              .then((vps) => vps.state === VPS.OPTION_STATES.SUBSCRIBED)
              .catch(() => false)
          : false,
      isAutomatedBackupAvailable: /* @ngInject */ (ovhFeatureFlipping) => {
        const automatedBackupId = 'vps:automateBackup';
        return ovhFeatureFlipping
          .checkFeatureAvailability(automatedBackupId)
          .then((automatedBackupFeature) =>
            automatedBackupFeature.isFeatureAvailable(automatedBackupId),
          );
      },
      goToVeeamOrderPage: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'vps::detail::veeam::activate',
          type: 'action',
        });
        $state.go('vps.detail.veeam.order');
      },
    },
  });
};
