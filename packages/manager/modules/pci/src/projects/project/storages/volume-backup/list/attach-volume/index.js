import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/manager-core';

import { VOLUME_BACKUP_ROUTES } from '../../volume-backup.constants';

const { ATTACH_VOLUME: ATTACH_VOLUME_ROUTE } = VOLUME_BACKUP_ROUTES.LIST.ROUTES;

const moduleName =
  'ovhManagerPciProjectStoragesVolumeBackupListAttachVolumeLazyLoading';

angular
  .module(moduleName, ['ui.router', 'ovhManagerCore', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(`${ATTACH_VOLUME_ROUTE.STATE}.**`, {
        url: ATTACH_VOLUME_ROUTE.URL,
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./attach-volume.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
