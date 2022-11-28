import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './download-rclone.component';
import routing from './download-rclone.routing';

const moduleName =
  'ovhManagerPciProjectsProjectStoragesColdArchiveUsersDownloadRclone';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component(
    'pciProjectsProjectStoragesColdArchiveUsersDownloadRclone',
    component,
  )
  .config(routing)
  .config(
    /* @ngInject */ ($compileProvider) => {
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|s?ftp|mailto|tel|file|data):/,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
