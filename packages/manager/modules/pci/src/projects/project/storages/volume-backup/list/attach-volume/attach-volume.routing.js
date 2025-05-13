import {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../../volume-backup.constants';

const { ATTACH_VOLUME: ATTACH_VOLUME_ROUTE } = VOLUME_BACKUP_ROUTES.LIST.ROUTES;

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(ATTACH_VOLUME_ROUTE.STATE, {
    url: ATTACH_VOLUME_ROUTE.URL,
    views: {
      modal: {
        component: 'ovhManagerPciProjectStoragesVolumeBackupListAttachVolume',
      },
    },
    layout: 'modal',
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('volumeDetached')
        .then((volumeDetached) =>
          volumeDetached ? false : { state: VOLUME_BACKUP_ROUTES.LIST.STATE },
        );
    },
    atInternet: {
      rename: `${VOLUME_BACKUP_TRACKING.PREFIX}`,
    },
    resolve: {
      breadcrumb: () => null,

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
