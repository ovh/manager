import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import { COLD_ARCHIVE_STATES } from './download-rclone.constants';

const moduleName = 'ovhManagerPciUsersColdArchiveDownloadRcloneLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(`${COLD_ARCHIVE_STATES.S3_USERS_DOWNLOAD_RCLONE}.**`, {
      url: '/rclone/download',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./download-rclone.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
