import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';
import { VOLUME_BACKUP_ROUTES } from '../volume-backups.constants';

const moduleName =
  'ovhManagerPciProjectStoragesVolumeBackupDashboardLazyloading';
angular
  .module(moduleName, ['ui.router', 'ovhManagerCore', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(`${VOLUME_BACKUP_ROUTES.DASHBOARD.STATE}.**`, {
        url: '/:notebookId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./dashboard.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
