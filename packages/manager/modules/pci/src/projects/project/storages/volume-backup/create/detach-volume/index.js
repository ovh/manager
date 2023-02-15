import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/manager-core';

import { VOLUME_BACKUP_ROUTES } from '../../volume-backup.constants';

const {
  DETACH_VOLUME: DETACH_VOLUME_ROUTE,
} = VOLUME_BACKUP_ROUTES.CREATE.ROUTES;

const moduleName =
  'ovhManagerPciProjectStoragesVolumeBackupCreateDetachVolumeLazyloading';

angular
  .module(moduleName, ['ui.router', 'ovhManagerCore', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(`${DETACH_VOLUME_ROUTE.STATE}.**`, {
        url: DETACH_VOLUME_ROUTE.URL,
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./detach-volume.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
