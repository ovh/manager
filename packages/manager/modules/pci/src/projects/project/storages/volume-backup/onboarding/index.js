import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import { VOLUME_BACKUP_ROUTES } from '../volume-backup.constants';

const moduleName =
  'ovhManagerPciProjectStoragesVolumeBackupOnboardingLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(`${VOLUME_BACKUP_ROUTES.ONBOARDING.STATE}.**`, {
      url: VOLUME_BACKUP_ROUTES.ONBOARDING.URL,
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./onboarding.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
