import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';
import { VOLUME_BACKUP_ROUTES } from '../../volume-backup.constants';

const moduleName =
  'ovhManagerPciProjectStoragesVolumeBackupListDeleteLazyloading';
angular
  .module(moduleName, ['ui.router', 'ovhManagerCore', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        `${VOLUME_BACKUP_ROUTES.LIST.ROUTES.DELETE.STATE}.**`,
        {
          url: VOLUME_BACKUP_ROUTES.LIST.ROUTES.DELETE.URL,
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./delete.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      );
    },
  );

export default moduleName;
