import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';
import { VOLUME_BACKUP_STATES } from './volume-backup.constants';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackupLazyloading';

angular
  .module(moduleName, ['ui.router', 'ovhManagerCore', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(`${VOLUME_BACKUP_STATES.ROOT.STATE}.**`, {
        url: VOLUME_BACKUP_STATES.ROOT.URL,
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./volume-backup.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
