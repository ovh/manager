import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';
import { VOLUME_BACKUP_ROUTES } from '../volume-backup.constants';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackupAddLazyloading';

angular
  .module(moduleName, ['ui.router', 'ovhManagerCore', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(`${VOLUME_BACKUP_ROUTES.ADD.STATE}.**`, {
        url: VOLUME_BACKUP_ROUTES.ADD.URL,
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./add.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
