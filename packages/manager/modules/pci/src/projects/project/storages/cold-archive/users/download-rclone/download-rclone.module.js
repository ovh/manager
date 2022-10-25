import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './download-rclone.routing';
import rClone from '../../../../../../components/users/download-rclone';

const moduleName = 'ovhManagerPciUsersObjectStorageDownloadRcloneABC';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    rClone,
  ])
  .config(routing)
  .config(
    /* @ngInject */ ($compileProvider) => {
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|s?ftp|mailto|tel|file|data):/,
      );
    },
  );

export default moduleName;
